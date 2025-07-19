from typing import Dict, List, Optional
from fastapi import FastAPI, UploadFile
import requests


class RAGPipeline:
    """Main RAG pipeline that orchestrates all components."""
    # def reset(self) -> None:
    #     """Reset the datastore."""
    #     self.datastore.reset()

    async def add_documents(self, documents: List[str]) -> None:
        """Index a list of documents."""
        for document in documents:
            try:
                document_content = await document.read()
            except Exception as e:
                raise Exception("Something went wrong while reading document content.\n" + str(e))

            document = {
                "document": (document.filename, document_content, document.content_type)
            }
            
            # Chunk document
            response = requests.post(
                "http://chunker:8000/",
                files=document
            )
            if not response.ok:
                raise Exception(f"Something went wrong while chunking the document. Response code: {response.status_code}. {response.text}")
            items = response.json()

            
            # Store chunked document into datastore
            response = requests.post(
                "http://datastore:8000",
                json=items
            )
            if not response.ok:
                raise Exception(f"Something went wrong while chunking the document. Response code: {response.status_code}. {response.text}")

    # def process_query(self, query: str) -> str:
    #     search_results = self.datastore.search(query)
    #     print(f"✅ Found {len(search_results)} results for query: {query}\n")

    #     for i, result in enumerate(search_results):
    #         print(f"🔍 Result {i+1}: {result}\n")
    #     response = self.response_generator.generate_response(query, search_results)
    #     return response

    # def evaluate(
    #     self, sample_questions: List[Dict[str, str]]
    # ) -> List[EvaluationResult]:
    #     # Evaluate a list of question/answer pairs.
    #     questions = [item["question"] for item in sample_questions]
    #     expected_answers = [item["answer"] for item in sample_questions]

    #     results = []
    #     for i in range(len(questions)):
    #         res = self._evaluate_single_question(questions[i], expected_answers[i])
    #         results.append(res)
  
    #     for i, result in enumerate(results):
    #         result_emoji = "✅" if result.is_correct else "❌"
    #         print(f"{result_emoji} Q {i+1}: {result.question}: \n")
    #         print(f"Response: {result.response}\n")
    #         # print(f"Expected Answer: {result.expected_answer}\n")
    #         print(f"Reasoning: {result.reasoning}\n")
    #         print("--------------------------------")

    #     number_correct = sum(result.is_correct for result in results)
    #     print(f"✨ Total Score: {number_correct}/{len(results)}")
    #     return results

    # def _evaluate_single_question(
    #     self, question: str, expected_answer: str
    # ) -> EvaluationResult:
    #     # Evaluate a single question/answer pair.
    #     response = self.process_query(question)
    #     return self.evaluator.evaluate(question, response, expected_answer, self.datastore)



app = FastAPI()
pipeline = None

@app.on_event("startup")
def startup():
    global pipeline
    pipeline = RAGPipeline()

@app.get("/")
def hello():
    return {"Response": "Hello!"}

@app.post("/")
async def upload(files: List[UploadFile]):
    response = await pipeline.add_documents(files)
    return response
