from fastapi import FastAPI
from pydantic import BaseModel

import os
import re

from dotenv import load_dotenv
from pinecone import Pinecone

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate


# ============================================================
# 1. LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()

app = FastAPI()


class DebugRequest(BaseModel):
    code: str
    prompt: str


PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")

INDEX_NAME = os.environ.get(
    "PINECONE_INDEX_NAME",
    "hw-manuals"
)

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")


# ============================================================
# Validate API Keys
# ============================================================

if not PINECONE_API_KEY:
    raise ValueError(
        "❌ PINECONE_API_KEY is missing from your .env file."
    )

if not GROQ_API_KEY:
    raise ValueError(
        "❌ GROQ_API_KEY is missing from your .env file."
    )


# ============================================================
# 2. INITIALIZE AI BRAIN
# ============================================================

print("Booting up RAG Engine...")

print("Loading HuggingFace embedding model...")

embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

print("✅ Embedding model loaded.")


# ============================================================
# Connect to Pinecone
# ============================================================

print("Connecting to Pinecone...")

try:

    pc = Pinecone(
        api_key=PINECONE_API_KEY
    )

    # Check indexes
    indexes = pc.list_indexes()

    index_names = [
        index.name
        for index in indexes
    ]

except Exception as e:

    raise RuntimeError(
        f"❌ Failed to connect to Pinecone: {e}"
    )


# ============================================================
# Check requested index
# ============================================================

if INDEX_NAME not in index_names:

    raise ValueError(
        f"\n❌ Pinecone index '{INDEX_NAME}' does not exist.\n"
        f"Available indexes: {index_names}"
    )


# ============================================================
# Connect to Pinecone Index
# ============================================================

try:

    index = pc.Index(
        INDEX_NAME
    )

    print(
        f"✅ Connected to Pinecone index: {INDEX_NAME}"
    )

except Exception as e:

    raise RuntimeError(
        f"❌ Failed to connect to Pinecone index: {e}"
    )


# ============================================================
# Pinecone Retriever
# ============================================================

def retrieve_documents(
    query: str,
    k: int = 1
):
    """
    Generate an embedding for the user's query and perform
    similarity search directly against Pinecone.

    This replaces LangChain's PineconeVectorStore.
    """

    try:

        # ----------------------------------------------------
        # Generate query embedding
        # ----------------------------------------------------

        query_vector = embeddings.embed_query(
            query
        )


        # ----------------------------------------------------
        # Query Pinecone
        # ----------------------------------------------------

        results = index.query(
            vector=query_vector,
            top_k=k,
            include_metadata=True
        )


        # ----------------------------------------------------
        # Return Pinecone matches
        # ----------------------------------------------------

        return results.matches


    except Exception as e:

        print(
            f"❌ Pinecone retrieval error: {e}"
        )

        return []


# ============================================================
# 3. FORMAT INSTRUCTIONS & PARSER
# ============================================================

FORMAT_INSTRUCTIONS = """
Respond using EXACTLY this structure. No extra text outside
these sections.

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

<optimized code or revised text>

###END###
"""


def parse_structured_response(
    raw_text: str
) -> dict:
    """
    Bulletproof parser to extract the custom delimiters.
    """

    text = raw_text.strip()

    pattern = (
        r"###"
        r"(ROOT_CAUSE|REASONING|SOURCES|OPTIMIZED_CODE|END)"
        r"###"
    )

    parts = re.split(
        pattern,
        text
    )

    sections = {}

    for i in range(
        1,
        len(parts) - 1,
        2
    ):

        marker = parts[i]

        content = parts[i + 1].strip()

        if marker != "END":

            sections[marker] = content


    # --------------------------------------------------------
    # Root Cause
    # --------------------------------------------------------

    root_cause = sections.get(
        "ROOT_CAUSE",
        "No specific root cause identified."
    ).strip()


    # --------------------------------------------------------
    # Reasoning
    # --------------------------------------------------------

    reasoning = [

        line.lstrip(
            "-•* "
        ).strip()

        for line in sections.get(
            "REASONING",
            ""
        ).splitlines()

        if line.strip()
    ]


    if not reasoning:

        reasoning = [
            "No detailed reasoning provided."
        ]


    # --------------------------------------------------------
    # Sources
    # --------------------------------------------------------

    sources = [

        line.lstrip(
            "-•* "
        ).strip()

        for line in sections.get(
            "SOURCES",
            ""
        ).splitlines()

        if line.strip()
    ]


    # --------------------------------------------------------
    # Optimized Code
    # --------------------------------------------------------

    optimized_code = sections.get(
        "OPTIMIZED_CODE",
        ""
    ).strip()


    # Remove Markdown code fences
    optimized_code = re.sub(
        r"^```[a-zA-Z0-9+#.-]*\n?",
        "",
        optimized_code
    )

    optimized_code = re.sub(
        r"\n?```$",
        "",
        optimized_code
    ).strip()


    return {
        "rootCause": root_cause,
        "reasoning": reasoning,
        "optimizedCode": optimized_code,
        "sources": sources,
    }


# ============================================================
# 4. DYNAMIC LANGUAGE DETECTOR
# ============================================================

def detect_input_type(
    code: str
) -> str:

    text = code.strip().lower()

    if not text:
        return "unknown"


    hardware_patterns = [
        "module ",
        "always_ff",
        "always_comb",
        "always @",
        "logic ",
        "wire ",
        "reg ",
        "assign ",
        "axi",
        "ahb",
        "apb",
        "spi",
        "i2c",
        "verilog",
        "systemverilog",
    ]


    software_patterns = [
        "#include",
        "def ",
        "console.log(",
        "public class",
        "import ",
        "function ",
        "const ",
        "let ",
        "class ",
    ]


    text_patterns = [
        "dear ",
        "sincerely",
        "cover letter",
        "resume",
        "to whom it may concern",
    ]


    if any(
        pattern in text
        for pattern in hardware_patterns
    ):

        return "hardware"


    if any(
        pattern in text
        for pattern in software_patterns
    ):

        return "software"


    if any(
        pattern in text
        for pattern in text_patterns
    ):

        return "text"


    return "unknown"


# ============================================================
# 5. CONTEXT-AWARE PROMPTS
# ============================================================

hardware_template = """
You are a senior hardware architect and RTL debugging assistant.

Analyze the provided hardware code.

Identify:
- Logic bugs
- RTL bugs
- Timing issues
- Protocol violations
- Reset problems
- FSM issues
- Width mismatches
- Combinational/sequential logic problems
- Architectural flaws

Use the retrieved hardware documentation to support your answer.

Retrieved Documentation:

{context}

User's Code:

{code}

Engineer's Question:

{question}

""" + FORMAT_INSTRUCTIONS


software_template = """
You are a senior software engineer and code-review expert.

Analyze the provided software code for:

- Bugs
- Logic errors
- Runtime issues
- Incorrect assumptions
- Performance problems
- Best-practice violations

Use the retrieved documentation when relevant.

Retrieved Documentation:

{context}

User's Code:

{code}

User's Question:

{question}

""" + FORMAT_INSTRUCTIONS


text_template = """
You are an expert professional writing and editing assistant.

Review the provided text document such as:
- Cover letter
- Email
- Resume
- Professional message

Improve:
- Grammar
- Clarity
- Professional tone
- Structure
- Conciseness

Provide the fully revised text inside the
OPTIMIZED_CODE section.

User's Text:

{code}

User's Request:

{question}

""" + FORMAT_INSTRUCTIONS


def choose_template(
    input_type: str
) -> str:

    if input_type == "hardware":
        return hardware_template

    if input_type == "software":
        return software_template

    if input_type == "text":
        return text_template

    return software_template


# ============================================================
# 6. FORMAT PINECONE DOCUMENTS
# ============================================================

def format_docs(
    matches
):

    if not matches:

        return (
            "No relevant documentation found."
        )


    formatted_documents = []


    for match in matches:

        metadata = match.metadata or {}


        source = metadata.get(
            "source",
            "Manual"
        )


        text = metadata.get(
            "text",
            ""
        )


        page = metadata.get(
            "page",
            "Unknown"
        )


        score = getattr(
            match,
            "score",
            None
        )


        # ----------------------------------------------------
        # Hard cap each retrieved chunk
        # ----------------------------------------------------

        text = str(text)[:1500]


        formatted_document = (
            f"Source: {source}\n"
            f"Page: {page}\n"
            f"Similarity Score: {score}\n"
            f"Content: {text}"
        )


        formatted_documents.append(
            formatted_document
        )


    return "\n\n--- DOCUMENT ---\n\n".join(
        formatted_documents
    )


# ============================================================
# 7. INITIALIZE GROQ LLM
# ============================================================

print("Booting up Groq Engine...")


llm = ChatGroq(

    temperature=0,

    model_name="llama-3.1-8b-instant",

    api_key=GROQ_API_KEY,

    max_tokens=2048,
)


print(
    "✅ Groq Engine ready."
)


# ============================================================
# 8. API ENDPOINT
# ============================================================

@app.post("/api/ml/analyze")
async def analyze_hardware(
    request: DebugRequest
):

    print(
        "\n--- RECEIVED PAYLOAD FROM NODE.JS ---"
    )


    # ========================================================
    # Safety cap incoming code
    # ========================================================

    safe_code = request.code[:3000]


    # ========================================================
    # Detect input type
    # ========================================================

    input_type = detect_input_type(
        safe_code
    )


    print(
        f"Detected input type: {input_type}"
    )


    # ========================================================
    # Retrieve relevant documentation
    # ========================================================

    if input_type in [
        "hardware",
        "software"
    ]:

        print(
            "🔎 Searching Pinecone..."
        )


        # ----------------------------------------------------
        # Search using user's question
        # ----------------------------------------------------

        search_query = request.prompt[:500]


        matches = retrieve_documents(
            search_query,
            k=1
        )


        print(
            f"Found {len(matches)} relevant document(s)."
        )


        context = format_docs(
            matches
        )


    else:

        context = (
            "No technical manual required "
            "for general text editing."
        )


    # ========================================================
    # Select prompt
    # ========================================================

    active_template = choose_template(
        input_type
    )


    dynamic_prompt = PromptTemplate(

        template=active_template,

        input_variables=[
            "context",
            "code",
            "question"
        ],
    )


    # ========================================================
    # Build final prompt
    # ========================================================

    formatted_prompt = dynamic_prompt.format(

        context=context,

        code=safe_code,

        question=request.prompt[:500],
    )


    # ========================================================
    # Generate response from Groq
    # ========================================================

    try:

        print(
            "🤖 Sending request to Groq..."
        )


        ai_message = llm.invoke(
            formatted_prompt
        )


        raw_text = ai_message.content


    except Exception as e:

        print(
            f"❌ LLM API Error: {e}"
        )


        return {

            "analysis": {

                "rootCause": (
                    f"LLM API Error: {str(e)}"
                ),

                "reasoning": [
                    "The AI engine encountered an error "
                    "while processing the request."
                ],

                "optimizedCode": "",

                "sources": []
            },

            "detectedType": input_type
        }


    # ========================================================
    # Parse structured response
    # ========================================================

    response_json = parse_structured_response(
        raw_text
    )


    print(
        "\n--- GENERATED STRUCTURED RESPONSE ---"
    )


    print(
        response_json
    )


    # ========================================================
    # Return response to Node.js
    # ========================================================

    return {

        "analysis": response_json,

        "detectedType": input_type
    }


# ============================================================
# 9. Health Check Endpoint
# ============================================================

@app.get("/")
async def root():

    return {
        "status": "online",
        "service": "Intelligent Hardware RTL Debugging Assistant",
        "pinecone_index": INDEX_NAME
    }