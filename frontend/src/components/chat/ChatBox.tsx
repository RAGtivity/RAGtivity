import { useState, useRef, useEffect } from "react"; 
import ChatMessage from "./ChatMessage";
import type { RagResponse } from "../../types/rag";
import { queryRag } from "../services/ragApi";
import { ArrowRightIcon } from "@heroicons/react/24/solid"; 

export default function ChatBox() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<RagResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const ask = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    const data = await queryRag(question);
    setResponse(data);
    setQuestion("");
    setIsLoading(false);
  };

  // Scroll to bottom on new response
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [response, isLoading]);

  return (
    <div className="flex flex-col w-full max-w-3xl h-screen mx-auto px-4">
      
      {/* Header */}
      <h1 className="text-center text-3xl font-semibold text-gray-100 my-4">
        RAGtivity
      </h1>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4">
        {response ? (
          <ChatMessage data={response} />
        ) : !isLoading ? (
          <p className="text-gray-500 text-center mt-10">
            Ask something to get started
          </p>
        ) : null}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input area (sticky bottom) */}
      <div className="sticky bottom-0 bg-[#020617] p-4 flex items-center gap-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
          placeholder="Type your question..."
          className="
            flex-1 bg-[#020617] text-gray-100 placeholder-gray-500
            text-lg px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500
          "
          disabled={isLoading}
        />

        <button
          onClick={ask}
          className="
            p-3 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center
            transition disabled:opacity-50
          "
          disabled={isLoading}
        >
          <ArrowRightIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
