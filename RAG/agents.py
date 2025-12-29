from langchain.agents import create_agent
from tools import retrieve_context 
from config import model

def create_rag_agent():
    tools = [retrieve_context]

    system_prompt = (
        "You have access to tools to retrieve context from documents or web pages. "
        "Use them when needed to answer user questions."
    )

    return create_agent(
        model=model,
        tools=tools,
        system_prompt=system_prompt,
    )
