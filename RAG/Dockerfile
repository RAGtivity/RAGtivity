FROM python:3.12-slim

WORKDIR /app

ENV GEMINI_API_KEY=AIzaSyAIt9SC_2Gc1osc0lmiePSwj_R3a7IuoEs

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

