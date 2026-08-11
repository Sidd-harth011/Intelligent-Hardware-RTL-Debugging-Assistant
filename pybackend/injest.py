import os
from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEndpointEmbeddings
from pinecone import Pinecone


# ============================================================
# Load environment variables
# ============================================================

load_dotenv()


# ============================================================
# Configuration
# ============================================================

DOCS_DIR = "./docs"

INDEX_NAME = os.environ.get(
    "PINECONE_INDEX_NAME",
    "hw-manuals"
)

PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")


# ============================================================
# Validate environment
# ============================================================

if not PINECONE_API_KEY:
    raise ValueError(
        "PINECONE_API_KEY is missing from your .env file."
    )


# ============================================================
# Main ingestion function
# ============================================================

def process_manuals():

    print("=" * 70)
    print("Starting Multi-Document Hardware Manual Ingestion")
    print("PDF → Chunks → HuggingFace Embeddings → Pinecone")
    print("=" * 70)


    # --------------------------------------------------------
    # 1. Check docs directory
    # --------------------------------------------------------

    if not os.path.exists(DOCS_DIR):
        print(
            f"❌ Error: The directory '{DOCS_DIR}' does not exist."
        )
        return


    # --------------------------------------------------------
    # 2. Find PDF files
    # --------------------------------------------------------

    pdf_files = [
        f
        for f in os.listdir(DOCS_DIR)
        if f.lower().endswith(".pdf")
    ]


    if not pdf_files:
        print(
            f"❌ Error: No PDF files found in '{DOCS_DIR}'."
        )
        print("Please add at least one PDF file.")
        return


    print(
        f"\n📚 Found {len(pdf_files)} PDF(s):"
    )

    for pdf_file in pdf_files:
        print(f"   • {pdf_file}")


    # --------------------------------------------------------
    # 3. Load all PDFs
    # --------------------------------------------------------

    all_documents = []


    print("\n" + "-" * 70)
    print("Loading PDF documents...")
    print("-" * 70)


    for pdf_file in pdf_files:

        pdf_path = os.path.join(
            DOCS_DIR,
            pdf_file
        )


        print(
            f"\n📂 Loading: {pdf_file}"
        )


        try:

            loader = PyPDFLoader(pdf_path)

            documents = loader.load()


            # Add source filename to metadata
            for doc in documents:

                doc.metadata["source"] = pdf_file


            all_documents.extend(documents)


            print(
                f"   ✅ Loaded {len(documents)} page(s)"
            )


        except Exception as e:

            print(
                f"   ❌ Failed to load {pdf_file}"
            )

            print(
                f"   Error: {e}"
            )


    # --------------------------------------------------------
    # 4. Check whether documents were loaded
    # --------------------------------------------------------

    if not all_documents:

        print(
            "\n❌ No documents were successfully loaded."
        )

        return


    print(
        f"\n📄 Total pages loaded: {len(all_documents)}"
    )


    # --------------------------------------------------------
    # 5. Split documents into chunks
    # --------------------------------------------------------

    print("\n" + "-" * 70)
    print("Splitting documents into chunks...")
    print("-" * 70)


    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )


    chunks = text_splitter.split_documents(
        all_documents
    )


    print(
        f"✅ Created {len(chunks)} searchable chunks"
    )


    # --------------------------------------------------------
    # 6. Initialize HuggingFace embeddings
    # --------------------------------------------------------

    print("\n" + "-" * 70)
    print("Initializing HuggingFace embedding model...")
    print("-" * 70)


    print(
        "Model: all-MiniLM-L6-v2"
    )

    print(
        "Embedding dimension: 384"
    )


    try:

        embeddings = HuggingFaceEndpointEmbeddings(
            model="sentence-transformers/all-MiniLM-L6-v2",
            huggingfacehub_api_token=os.environ.get("HF_TOKEN")
        )


    except Exception as e:

        print(
            "\n❌ Failed to initialize HuggingFace embeddings."
        )

        print(
            f"Error: {e}"
        )

        return


    print(
        "✅ Embedding model initialized"
    )


    # --------------------------------------------------------
    # 7. Connect to Pinecone
    # --------------------------------------------------------

    print("\n" + "-" * 70)
    print("Connecting to Pinecone...")
    print("-" * 70)


    try:

        pc = Pinecone(
            api_key=PINECONE_API_KEY
        )


        print(
            "✅ Connected to Pinecone"
        )


    except Exception as e:

        print(
            "\n❌ Failed to connect to Pinecone."
        )

        print(
            f"Error: {e}"
        )

        return


    # --------------------------------------------------------
    # 8. Check Pinecone index
    # --------------------------------------------------------

    print(
        f"\nChecking Pinecone index: '{INDEX_NAME}'..."
    )


    try:

        indexes = pc.list_indexes()


        # Get index names
        index_names = [
            index.name
            for index in indexes
        ]


        if INDEX_NAME not in index_names:

            print(
                f"\n❌ Pinecone index '{INDEX_NAME}' does not exist."
            )

            print(
                "\nCreate a Pinecone index with:"
            )

            print(
                "   Dimension: 384"
            )

            print(
                "   Metric: cosine"
            )

            print(
                "   Index name: "
                f"{INDEX_NAME}"
            )

            return


        print(
            f"✅ Found Pinecone index: {INDEX_NAME}"
        )


    except Exception as e:

        print(
            "\n❌ Failed to check Pinecone index."
        )

        print(
            f"Error: {e}"
        )

        return


    # --------------------------------------------------------
    # 9. Connect to the index
    # --------------------------------------------------------

    try:

        index = pc.Index(
            INDEX_NAME
        )


        print(
            "✅ Connected to Pinecone index"
        )


    except Exception as e:

        print(
            "\n❌ Failed to connect to Pinecone index."
        )

        print(
            f"Error: {e}"
        )

        return


    # --------------------------------------------------------
    # 10. Generate embeddings
    # --------------------------------------------------------

    print("\n" + "-" * 70)
    print("Generating embeddings...")
    print("-" * 70)


    texts = [
        doc.page_content
        for doc in chunks
    ]


    try:

        vectors = embeddings.embed_documents(
            texts
        )


    except Exception as e:

        print(
            "\n❌ Failed to generate embeddings."
        )

        print(
            f"Error: {e}"
        )

        return


    print(
        f"✅ Generated {len(vectors)} embeddings"
    )


    # --------------------------------------------------------
    # 11. Verify embedding dimension
    # --------------------------------------------------------

    if not vectors:

        print(
            "\n❌ No embeddings were generated."
        )

        return


    embedding_dimension = len(
        vectors[0]
    )


    print(
        f"Embedding dimension: "
        f"{embedding_dimension}"
    )


    if embedding_dimension != 384:

        print(
            "\n⚠️ Warning:"
        )

        print(
            "The embedding dimension is not 384."
        )


    # --------------------------------------------------------
    # 12. Prepare Pinecone records
    # --------------------------------------------------------

    print("\n" + "-" * 70)
    print("Preparing Pinecone vectors...")
    print("-" * 70)


    records = []


    for i, (text, vector, doc) in enumerate(
        zip(
            texts,
            vectors,
            chunks
        )
    ):

        record = {
            "id": f"hardware-manual-{i}",

            "values": vector,

            "metadata": {
                "text": text,

                "source": doc.metadata.get(
                    "source",
                    "unknown"
                ),

                "page": doc.metadata.get(
                    "page",
                    None
                )
            }
        }


        records.append(record)


    print(
        f"✅ Prepared {len(records)} vectors"
    )


    # --------------------------------------------------------
    # 13. Upload vectors to Pinecone
    # --------------------------------------------------------

    print("\n" + "-" * 70)
    print(
        f"Uploading vectors to Pinecone index "
        f"'{INDEX_NAME}'..."
    )
    print("-" * 70)


    batch_size = 100


    total_records = len(records)


    try:

        for start in range(
            0,
            total_records,
            batch_size
        ):

            end = min(
                start + batch_size,
                total_records
            )


            batch = records[
                start:end
            ]


            index.upsert(
                vectors=batch
            )


            print(
                f"   ✅ Uploaded "
                f"{end}/{total_records}"
            )


    except Exception as e:

        print(
            "\n❌ Failed while uploading vectors."
        )

        print(
            f"Error: {e}"
        )

        return


    # --------------------------------------------------------
    # 14. Success
    # --------------------------------------------------------

    print("\n")
    print("=" * 70)
    print("🎉 INGESTION COMPLETED SUCCESSFULLY!")
    print("=" * 70)

    print(
        f"📚 PDF files processed : {len(pdf_files)}"
    )

    print(
        f"📄 Pages loaded        : {len(all_documents)}"
    )

    print(
        f"🧩 Chunks created       : {len(chunks)}"
    )

    print(
        f"🧠 Embedding model      : all-MiniLM-L6-v2"
    )

    print(
        f"📐 Vector dimension     : {embedding_dimension}"
    )

    print(
        f"🌲 Pinecone index       : {INDEX_NAME}"
    )

    print(
        f"🚀 Vectors uploaded     : {len(records)}"
    )

    print("=" * 70)


# ============================================================
# Run script
# ============================================================

if __name__ == "__main__":
    process_manuals()