from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer

class ChunkEmbedService:
    def __init__(
        self,
        chunk_size=1000,
        chunk_overlap=200,
        model_name="all-MiniLM-L6-v2"
    ):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            add_start_index=True
        )
        self.model = SentenceTransformer(model_name)

    def process(self, text: str):
        docs = self.splitter.create_documents([text])

        chunks = [d.page_content for d in docs]
        embeddings = self.model.encode(chunks).tolist()

        return chunks, embeddings
