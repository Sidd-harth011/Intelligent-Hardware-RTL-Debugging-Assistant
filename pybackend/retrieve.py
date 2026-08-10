import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# 1. Load environment variables (API Key)
load_dotenv()

# 2. Initialize Embeddings and Vector DB
print("Loading ChromaDB...")
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
db = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)
retriever = db.as_retriever(search_kwargs={"k": 3})

# 3. Initialize Groq LLM
print("Booting up Groq Engine...")
llm = ChatGroq(
    temperature=0, # 0 means strictly factual and analytical, perfect for hardware docs
    model_name="llama3-8b-8192", # Blazing fast, open-weights model
    api_key=os.environ.get("GROQ_API_KEY")
)

# 4. Build the Hardware Architect Prompt
template = """You are a senior hardware architect and RTL debugging assistant.
Use the following pieces of retrieved technical documentation to answer the engineer's question.
If you don't know the answer based on the provided context, just say that you don't know. Do not hallucinate.
Keep the answer concise, highly technical, and strictly based on the manuals.

Context: {context}

Question: {question}

Answer:"""
prompt = PromptTemplate.from_template(template)

# Helper to format retrieved documents into a single string
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# 5. Chain it all together (LangChain Expression Language)
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# 6. Test the Brain
test_question = "What are the three RISC-V privilege levels?"
print(f"\n🔍 Asking Groq: '{test_question}'\n")

response = rag_chain.invoke(test_question)
print("--- AI RESPONSE ---")
print(response)