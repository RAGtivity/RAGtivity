
docker run --env-file .env rag-app query --question "Who is Mrs. Elara Nightingale"
docker run --env-file .env -v %cd%/sample_data:/app/sample_data rag-app upload --source pdf --input sample_data/source/attention_is_all_you_need.pdf

curl -X POST http://localhost:8000/query -H "Content-Type: application/json" -d "{\"question\":\"Who is Mrs. Elara Nightingale?\"}"

Source: {'creator': 'PyPDF', 'creationdate': '', 'start_index': 799, 'total_pages': 3, 'page_label': '2', 'producer': 'Skia/PDF m134 Google Docs Renderer', 'title': 'Welcome to Swan Lagoon', 'page': 1, 'source': 'sample_data/source/sl_booklet.pdf'}\n
