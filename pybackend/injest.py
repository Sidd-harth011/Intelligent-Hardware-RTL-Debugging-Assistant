import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

# Define directories
DOCS_DIR = "./docs"
CHROMA_PATH = "./chroma_db"

def process_manuals():
    print("--- Starting Multi-Document Hardware Manual Ingestion ---")
    
    if not os.path.exists(DOCS_DIR):
        print(f"Error: The directory '{DOCS_DIR}' does not exist.")
        return

    # 1. Automatically find all PDF files in the docs directory
    pdf_files = [f for f in os.listdir(DOCS_DIR) if f.lower().endswith('.pdf')]
    
    if not pdf_files:
        print(f"⚠️ Error: No PDF files found in '{DOCS_DIR}'. Please add at least one PDF.")
        return

    print(f"Found {len(pdf_files)} PDF(s) to ingest: {pdf_files}")
    
    all_documents = []

    # 2. Loop through every PDF found and load it
    for pdf_file in pdf_files:
        pdf_path = os.path.join(DOCS_DIR, pdf_file)
        print(f"\n📂 Loading: {pdf_file}...")
        
        try:
            loader = PyPDFLoader(pdf_path)
            documents = loader.load()
            
            # Tag every single chunk with its source filename for tracking
            for doc in documents:
                doc.metadata["source"] = pdf_file
                
            all_documents.extend(documents)
            print(f"Successfully loaded {len(documents)} pages from {pdf_file}.")
        except Exception as e:
            print(f"❌ Failed to load {pdf_file}: {e}")

    if not all_documents:
        print("Error: No documents were successfully loaded.")
        return

    # 3. Chunk the Combined Text
    print("\nChunking text across all documents...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, 
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_documents(all_documents)
    print(f"Split all manuals into a total of {len(chunks)} searchable chunks.")
    
    # 4. Initialize AI Embedding Model
    print("\n--- Initializing AI Embedding Model ---")
    print("Loading HuggingFace model (all-MiniLM-L6-v2)...")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    # 5. Build/Update Vector Database in ChromaDB
    print("\n--- Building Vector Database (This may take a moment) ---")
    db = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_PATH
    )
    
    print(f"\n✅ SUCCESS! Embedded and saved {len(chunks)} total chunks from {len(pdf_files)} file(s) to the '{CHROMA_PATH}' folder.")

if __name__ == "__main__":
    process_manuals()