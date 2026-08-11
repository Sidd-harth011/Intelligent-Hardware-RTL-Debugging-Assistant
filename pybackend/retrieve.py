import os

from dotenv import load_dotenv
from pinecone import Pinecone

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_core.documents import Document
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser


# ============================================================
# 1. Load environment variables
# ============================================================

load_dotenv()

PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")

INDEX_NAME = os.environ.get(
    "PINECONE_INDEX_NAME",
    "hw-manuals"
)

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")


# ============================================================
# 2. Validate API keys
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
# 3. Initialize HuggingFace Embeddings
# ============================================================

print("Loading HuggingFace embedding model...")

embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

print("✅ Embedding model loaded.")


# ============================================================
# 4. Connect to Pinecone
# ============================================================

print("Connecting to Pinecone...")

pc = Pinecone(
    api_key=PINECONE_API_KEY
)


# ------------------------------------------------------------
# Check whether index exists
# ------------------------------------------------------------

try:

    indexes = pc.list_indexes()

    index_names = [
        index.name
        for index in indexes
    ]

except Exception as e:

    raise RuntimeError(
        f"❌ Could not retrieve Pinecone indexes: {e}"
    )


if INDEX_NAME not in index_names:

    raise ValueError(
        f"\n❌ Pinecone index '{INDEX_NAME}' does not exist.\n"
        f"Available indexes: {index_names}"
    )


# ------------------------------------------------------------
# Connect to index
# ------------------------------------------------------------

index = pc.Index(
    INDEX_NAME
)

print(
    f"✅ Connected to Pinecone index: {INDEX_NAME}"
)


# ============================================================
# 5. Create Pinecone Retriever
# ============================================================

def retrieve_documents(
    query,
    k=3
):
    """
    Convert the user question into an embedding,
    search Pinecone for the most relevant chunks,
    and return LangChain Document objects.
    """

    # --------------------------------------------------------
    # Generate query embedding
    # --------------------------------------------------------

    query_vector = embeddings.embed_query(
        query
    )


    # --------------------------------------------------------
    # Search Pinecone
    # --------------------------------------------------------

    results = index.query(
        vector=query_vector,
        top_k=k,
        include_metadata=True
    )


    # --------------------------------------------------------
    # Convert Pinecone results into Documents
    # --------------------------------------------------------

    documents = []


    for match in results.matches:

        metadata = match.metadata or {}


        document = Document(

            page_content=metadata.get(
                "text",
                ""
            ),

            metadata={
                "source": metadata.get(
                    "source",
                    "unknown"
                ),

                "page": metadata.get(
                    "page",
                    None
                ),

                "score": match.score
            }
        )


        documents.append(
            document
        )


    return documents


# ============================================================
# 6. Create Retriever-compatible function
# ============================================================

def format_docs(docs):

    if not docs:
        return "No relevant documentation was found."


    formatted_documents = []


    for doc in docs:

        source = doc.metadata.get(
            "source",
            "unknown"
        )

        page = doc.metadata.get(
            "page",
            "unknown"
        )

        formatted_documents.append(
            f"Source: {source}\n"
            f"Page: {page}\n"
            f"{doc.page_content}"
        )


    return "\n\n--- DOCUMENT ---\n\n".join(
        formatted_documents
    )


# ============================================================
# 7. Initialize Groq LLM
# ============================================================

print("Booting up Groq Engine...")


llm = ChatGroq(

    temperature=0,

    model_name="llama-3.1-8b-instant",

    api_key=GROQ_API_KEY
)


print("✅ Groq engine ready.")


# ============================================================
# 8. Hardware Architect Prompt
# ============================================================

template = """
You are a senior hardware architect and RTL debugging assistant.

Use the retrieved technical documentation below to answer
the engineer's question.

IMPORTANT RULES:

1. Answer strictly using the provided documentation.
2. Do not hallucinate or invent information.
3. If the documentation does not contain enough information
   to answer the question, say:
   "I don't know based on the provided documentation."
4. Keep the answer concise and highly technical.
5. When useful, mention the relevant source document and page.
6. Focus on hardware architecture, RTL, CPU architecture,
   buses, protocols, registers, timing, and implementation
   details when applicable.

Retrieved Documentation:

{context}

Engineer Question:

{question}

Answer:
"""


prompt = PromptTemplate.from_template(
    template
)


# ============================================================
# 9. Build RAG Chain
# ============================================================

def get_context(question):

    documents = retrieve_documents(
        question,
        k=3
    )

    return format_docs(
        documents
    )


rag_chain = (

    {
        "context": get_context,

        "question": RunnablePassthrough()
    }

    | prompt

    | llm

    | StrOutputParser()
)


# ============================================================
# 10. Test the RAG System
# ============================================================

test_question = (
    "What are the three RISC-V privilege levels?"
)


print(
    f"\n🔍 Asking Hardware AI:\n"
    f"'{test_question}'\n"
)


try:

    response = rag_chain.invoke(
        test_question
    )


    print(
        "\n" + "=" * 70
    )

    print(
        "🤖 AI RESPONSE"
    )

    print(
        "=" * 70
    )

    print(
        response
    )

    print(
        "=" * 70
    )


except Exception as e:

    print(
        "\n❌ RAG pipeline failed."
    )

    print(
        f"Error: {e}"
    )