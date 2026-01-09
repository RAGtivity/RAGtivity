FROM python:3.11-slim

WORKDIR /app

# Minimal system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy application code
COPY . .

# Install CPU-only PyTorch FIRST (critical)
RUN pip install --no-cache-dir \
    torch==2.2.2+cpu \
    torchvision==0.17.2+cpu \
    torchaudio==2.2.2+cpu \
    --index-url https://download.pytorch.org/whl/cpu

# Install remaining Python dependencies
RUN pip install --no-cache-dir \
    fastapi \
    uvicorn \
    python-multipart \
    pypdf \
    langchain-text-splitters \
    langchain-huggingface \
    sentence-transformers

CMD ["uvicorn", "document_loader:app", "--host", "0.0.0.0", "--port", "8001"]
