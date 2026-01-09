FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip

COPY . .

RUN pip install \
    fastapi \
    uvicorn \
    langchain \
    langchain-community \
    langchain-huggingface \
    python-multipart \
    sentence-transformers \
    pypdf

CMD ["uvicorn", "document_loader:app", "--host", "0.0.0.0", "--port", "8001"]
