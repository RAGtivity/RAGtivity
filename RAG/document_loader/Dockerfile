FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY . .

RUN pip install --no-cache-dir \
    fastapi \
    uvicorn \
    python-multipart \
    pypdf \
    langchain-text-splitters \
    langchain-huggingface \
    sentence-transformers

CMD ["uvicorn", "document_loader:app", "--host", "0.0.0.0", "--port", "8001"]
