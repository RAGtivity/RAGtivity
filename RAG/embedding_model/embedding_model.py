from sentence_transformers import SentenceTransformer
from fastapi import FastAPI
from typing import List

class EmbeddingModel:
    def __init__(self):
        self.model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2', device='cpu')

    def get_embedding(self, content):
        embedding = self.model.encode(content, convert_to_numpy=True)
        return embedding.tolist()


app = FastAPI()
model = None

@app.on_event("startup")
def startup():
    global model
    model = EmbeddingModel()


@app.post("/")
def get_embedding(contents: List[str]):
    """
    Encode a list of sentences
    Parameters:
        request: POST request containing 'contents' field
    Return value:
        JSON of schema: 
            {
                embeddings: value   
            }
        where:
            embeddings: List[str]
    """
    embeddings = []
    for content in contents:
        embeddings.append(model.get_embedding(content))
    return embeddings
