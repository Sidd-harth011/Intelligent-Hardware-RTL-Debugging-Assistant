from fastapi import FastAPI
from pydantic import BaseModel
import os
import re
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate

# ==========================================
# 1. LOAD ENVIRONMENT VARIABLES
# ==========================================
load_dotenv()
app = FastAPI()

class DebugRequest(BaseModel):
    code: str
    prompt: str

# ==========================================
# 2. INITIALIZE AI BRAIN
# ==========================================
print("Booting up RAG Engine & ChromaDB...")
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
db = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)

# FIX 1: Reduce k from 3 to 1 to drastically cut down token usage.
retriever = db.as_retriever(search_kwargs={"k": 1})

llm = ChatGroq(
    temperature=0,
    model_name="llama-3.1-8b-instant",
    api_key=os.environ.get("GROQ_API_KEY"),
    max_tokens=2048, # Reduced max_tokens to leave room for the prompt
)

# ==========================================
# 3. FORMAT INSTRUCTIONS & PARSER
# ==========================================
FORMAT_INSTRUCTIONS = """
Respond using EXACTLY this structure. No extra text outside these sections. 
Each marker must be on its own line.

###ROOT_CAUSE###
<1-2 sentence summary of the issue, answer, or review result>

###REASONING###
- <point 1>
- <point 2>
- <point 3>

###SOURCES###
- <manual name, section used, or "General Knowledge">

###OPTIMIZED_CODE###
<The full corrected code or revised text. Leave empty if no fix is needed.>
###END###
"""

def parse_structured_response(raw_text: str) -> dict:
    """Bulletproof parser to extract the custom delimiters."""
    text = raw_text.strip()
    pattern = r"###(ROOT_CAUSE|REASONING|SOURCES|OPTIMIZED_CODE|END)###"
    parts = re.split(pattern, text)

    sections = {}
    for i in range(1, len(parts) - 1, 2):
        marker = parts[i]
        content = parts[i + 1].strip()
        if marker != "END":
            sections[marker] = content

    root_cause = sections.get("ROOT_CAUSE", "No specific root cause identified.").strip()

    reasoning = [
        line.lstrip("-•* ").strip()
        for line in sections.get("REASONING", "").splitlines()
        if line.strip()
    ]
    if not reasoning:
        reasoning = ["No detailed reasoning provided."]

    sources = [
        line.lstrip("-•* ").strip()
        for line in sections.get("SOURCES", "").splitlines()
        if line.strip()
    ]

    optimized_code = sections.get("OPTIMIZED_CODE", "").strip()
    optimized_code = re.sub(r"^```[a-zA-Z0-9]*\n?", "", optimized_code)
    optimized_code = re.sub(r"\n?```$", "", optimized_code).strip()

    return {
        "rootCause": root_cause,
        "reasoning": reasoning,
        "optimizedCode": optimized_code,
        "sources": sources,
    }

# ==========================================
# 4. DYNAMIC LANGUAGE DETECTOR
# ==========================================
def detect_input_type(code: str) -> str:
    text = code.strip().lower()
    if not text:
        return "unknown"
        
    hardware_patterns = ["module ", "always_ff", "logic ", "always @", "wire ", "reg ", "axi", "spi"]
    software_patterns = ["#include", "def ", "console.log(", "public class", "import "]
    text_patterns = ["dear ", "sincerely", "cover letter", "resume", "to whom it may concern"]

    if any(p in text for p in hardware_patterns): return "hardware"
    if any(p in text for p in software_patterns): return "software"
    if any(p in text for p in text_patterns): return "text"
    return "unknown"

# ==========================================
# 5. CONTEXT-AWARE PROMPTS
# ==========================================
hardware_template = """You are a senior hardware architect and RTL debugging assistant. 
Analyze the provided hardware code. Identify logic bugs, timing issues, or architectural flaws.
Use the retrieved hardware documentation to back up your answer.

Retrieved Documentation: {context}
User's Code: {code}
Engineer's Question: {question}
""" + FORMAT_INSTRUCTIONS

software_template = """You are a senior software engineer and code-review expert. 
Analyze the provided software code for bugs, logic errors, and best practices.

Retrieved Documentation: {context}
User's Code: {code}
User's Question: {question}
""" + FORMAT_INSTRUCTIONS

text_template = """You are an expert professional writing and editing assistant. 
Review the provided text document (e.g., cover letter, email) for grammar, clarity, and professional tone.
Provide the fully revised text inside the OPTIMIZED_CODE section.

User's Text: {code}
User's Request: {question}
""" + FORMAT_INSTRUCTIONS

def choose_template(input_type: str) -> str:
    if input_type == "hardware": return hardware_template
    if input_type == "software": return software_template
    if input_type == "text": return text_template
    return software_template 

def format_docs(docs):
    if not docs: return "No relevant documentation found."
    # FIX 2: Hard-cap document length so it doesn't blow up Groq's TPM limits
    return "\n\n".join(f"Source: {doc.metadata.get('source', 'Manual')}\nContent: {doc.page_content[:1500]}" for doc in docs)

# ==========================================
# 6. API ENDPOINT
# ==========================================
@app.post("/api/ml/analyze")
async def analyze_hardware(request: DebugRequest):
    print("\n--- RECEIVED PAYLOAD FROM NODE.JS ---")
    
    # FIX 3: Safety cap the incoming code string just in case the file is massive
    safe_code = request.code[:3000] 
    
    input_type = detect_input_type(safe_code)
    print(f"Detected input type: {input_type}")

    if input_type in ["hardware", "software"]:
        docs = retriever.invoke(request.prompt)
        context = format_docs(docs)
    else:
        context = "No technical manual required for general text editing."

    active_template = choose_template(input_type)
    
    dynamic_prompt = PromptTemplate(
        template=active_template,
        input_variables=["context", "code", "question"],
    )

    formatted_prompt = dynamic_prompt.format(
        context=context,
        code=safe_code,
        question=request.prompt[:500], # Safety cap user prompt
    )

    # Generate response from Groq
    try:
        ai_message = llm.invoke(formatted_prompt)
        raw_text = ai_message.content
    except Exception as e:
        print(f"LLM API Error: {e}")
        # Fallback response if the API still crashes
        return {"analysis": {
            "rootCause": f"LLM API Error: {str(e)}",
            "reasoning": ["The AI engine is currently overloaded or out of tokens."],
            "optimizedCode": "",
            "sources": []
        }, "detectedType": input_type}

    # Run raw text through our parser
    response_json = parse_structured_response(raw_text)

    print("--- GENERATED STRUCTURED RESPONSE ---")
    print(response_json)

    return {"analysis": response_json, "detectedType": input_type}