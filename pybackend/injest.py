import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

# Define directories
DOCS_DIR = "./docs"
CHROMA_PATH = "./chroma_db"

def process_manuals():
    print("--- Starting Hardware Manual Ingestion ---")
    
    # 1. Load the PDF Document
    # Make sure this matches the exact name of your downloaded PDF!
    pdf_path = os.path.join(DOCS_DIR, "riscv-privileged.pdf")
    
    if not os.path.exists(pdf_path):
        print(f"Error: Could not find {pdf_path}.")
        return

    print(f"Loading {pdf_path}...")
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()
    
    # 2. Chunk the Text
    print("Chunking text...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, 
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Split the manual into {len(chunks)} searchable chunks.")
    
    # 3. Create Vector Embeddings and Store in ChromaDB
    print("\n--- Initializing AI Embedding Model ---")
    print("Downloading/Loading HuggingFace model (all-MiniLM-L6-v2)...")
    # This is a fast, lightweight model perfect for local text embeddings
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    print("\n--- Building Vector Database (This may take a minute) ---")
    # This line translates all 834 chunks into vectors and saves them to your hard drive
    db = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_PATH
    )
    
    print(f"\n✅ SUCCESS! Saved {len(chunks)} embedded chunks to the '{CHROMA_PATH}' folder.")

if __name__ == "__main__":
    process_manuals()