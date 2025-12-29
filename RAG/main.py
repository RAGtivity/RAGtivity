from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents import create_rag_agent
from database import vector_store
from document_loader import DocumentLoader
import os
import shutil
import re
import ast

UPLOAD_DIR = "./uploaded_docs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = create_rag_agent()

class QueryRequest(BaseModel):
    question: str


@app.get("/")
def root():
    return {"message": "RAG API is running"}


@app.post("/query")
def query_rag(request: QueryRequest):
    response_text = ""
    sources = []

    for event in agent.stream(
        {"messages": [{"role": "user", "content": request.question}]},
        stream_mode="values",
    ):
        content = event["messages"][-1].content

        # Extract all Source: {...} blocks
        source_matches = re.findall(r"Source: ({.*?})", content, re.DOTALL)
        for match in source_matches:
            try:
                sources.append(ast.literal_eval(match))
            except Exception:
                pass

        # Remove Source blocks from answer text
        response_text = re.sub(r"Source: ({.*?})", "", content, flags=re.DOTALL).strip()

    return {"answer": response_text, "sources": sources}


@app.post("/upload")
def upload_document(file: UploadFile = File(...)):
    """
    Upload a PDF document and add it to the vector store.
    """
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    # Save the uploaded file
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    
    # Load and store in vector store
    loader = DocumentLoader(file_path)
    loader.pdf_loader()  # Only PDF supported for now
    
    # Count chunks in vector store for this file
    all_docs = vector_store._collection.get()
    chunks = sum(1 for m in all_docs["metadatas"] if m.get("filename") == file.filename)
    
    return {"message": f"{file.filename} uploaded successfully", "chunks": chunks}


@app.get("/documents")
def get_documents():
    """
    Retrieve all documents in the vector store along with their chunk counts.
    """
    all_docs = []
    collection_data = vector_store._collection.get()
    ids = collection_data["ids"]
    metadatas = collection_data["metadatas"]

    # Create a dict to count chunks per file
    chunk_counts = {}
    for md in metadatas:
        filename = md.get("filename", "Unknown")
        chunk_counts[filename] = chunk_counts.get(filename, 0) + 1

    # Assign unique numeric ID for frontend
    for idx, filename in enumerate(chunk_counts.keys(), start=1):
        all_docs.append({
            "id": idx,
            "filename": filename,
            "chunks": chunk_counts[filename]
        })

    return {"documents": all_docs}
