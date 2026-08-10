from fastapi import FastAPI
from pydantic import BaseModel
import os
import re
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.messages import AIMessage

# 1. Load Environment Variables
load_dotenv()

app = FastAPI()

class DebugRequest(BaseModel):
    code: str
    prompt: str

# 2. Initialize AI Brain
print("Booting up RAG Engine & ChromaDB...")
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
db = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)
retriever = db.as_retriever(search_kwargs={"k": 3})

# NOTE: llama-3.1-8b-instant is on Groq's deprecation list. Swap to a
# current model if this stops working — check console.groq.com/docs/deprecations.
llm = ChatGroq(
    temperature=0,
    model_name="llama-3.1-8b-instant",
    api_key=os.environ.get("GROQ_API_KEY"),
    max_tokens=8192,
)

# 3. Delimiter-based format instead of JSON-embedded code.
# This is the actual fix: the model no longer has to escape quotes/newlines
# inside a JSON string to hand back multi-line RTL/C code, which is what
# was causing the garbled/chopped output.
FORMAT_INSTRUCTIONS = """
Respond using EXACTLY this structure. No markdown fences, no extra text
outside these sections, no bold. Each marker must be on its own line.

###ROOT_CAUSE###
<1-2 sentence summary of the issue or answer>

###REASONING###
- <point 1>
- <point 2>
- <point 3>

###SOURCES###
- <manual name or section used>

###OPTIMIZED_CODE###
<the full corrected code, verbatim, no truncation. Leave empty if no fix is needed.>
###END###
"""

template = """You are a senior hardware architect and RTL debugging assistant.
You handle Verilog, SystemVerilog, embedded C, and communication protocols
(SPI, I2C, UART, AXI, etc).
Use the following pieces of retrieved technical documentation to answer the engineer's question.

Context from Hardware Manuals:
{context}

User's Code:
{code}

Engineer's Question: {question}

""" + FORMAT_INSTRUCTIONS

prompt = PromptTemplate(
    template=template,
    input_variables=["context", "code", "question"],
)


def format_docs(docs):
    return "\n\n".join(f"Source: {doc.metadata.get('source', 'Manual')}\nContent: {doc.page_content}" for doc in docs)


def parse_structured_response(raw_text: str, was_truncated: bool) -> dict:
    text = raw_text.strip()
    truncated = was_truncated or ("###END###" not in text)

    pattern = r"###(ROOT_CAUSE|REASONING|SOURCES|OPTIMIZED_CODE|END)###"
    parts = re.split(pattern, text)

    sections = {}
    for i in range(1, len(parts) - 1, 2):
        marker = parts[i]
        content = parts[i + 1].strip()
        if marker != "END":
            sections[marker] = content

    root_cause = sections.get("ROOT_CAUSE", "").strip()

    reasoning = [
        line.lstrip("-• ").strip()
        for line in sections.get("REASONING", "").splitlines()
        if line.strip()
    ]

    sources = [
        line.lstrip("-• ").strip()
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
        "truncated": truncated,
    }


# 4. The API Endpoint
@app.post("/api/ml/analyze")
async def analyze_hardware(request: DebugRequest):
    print(f"\n--- RECEIVED PAYLOAD FROM NODE.JS ---")

    docs = retriever.invoke(request.prompt)
    context = format_docs(docs)

    formatted_prompt = prompt.format(
        context=context,
        code=request.code,
        question=request.prompt,
    )

    ai_message: AIMessage = llm.invoke(formatted_prompt)
    raw_text = ai_message.content
    finish_reason = (ai_message.response_metadata or {}).get("finish_reason")
    was_truncated = finish_reason == "length"

    if was_truncated:
        print("WARNING: generation hit max_tokens and was cut off.")

    response_json = parse_structured_response(raw_text, was_truncated)

    print("--- GENERATED STRUCTURED RESPONSE ---")
    print(response_json)

    return {"analysis": response_json}