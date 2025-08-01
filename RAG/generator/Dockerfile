FROM python:3.10-slim

ENV GEMINI_API_KEY=AIzaSyAIt9SC_2Gc1osc0lmiePSwj_R3a7IuoEs

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "generator:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]