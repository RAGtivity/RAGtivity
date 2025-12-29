from fastapi import FastAPI
from pydantic import BaseModel
from chunker import ChunkEmbedService

app = FastAPI()
service = ChunkEmbedService()

class ChunkRequest(BaseModel):
    text: str

@app.post("/chunk")
def chunk_and_embed(req: ChunkRequest):
    chunks, embeddings = service.process(req.text)
    return {
        "chunks": chunks,
        "embeddings": embeddings
    }
