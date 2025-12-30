import type { RagResponse } from "../../types/rag";

export default function ChatMessage({ data }: { data: RagResponse }) {
  return (
    <div className="space-y-6 text-gray-200">
      {/* AI Answer */}
      <div className="bg-[#020617] border border-gray-700 rounded-2xl p-5">
        <p className="leading-relaxed">
          <span className="font-semibold text-blue-400">AI:</span> {data.answer}
        </p>
      </div>

      {/* Tools */}
      {data.tools && (
        <div className="text-sm text-gray-400">
          <span className="font-medium text-gray-300">Tools:</span>{" "}
          {data.tools.join(", ")}
        </div>
      )}

      {/* Sources */}
      {data.sources && (
        <div className="text-xs text-gray-400 mt-2 space-y-1">
          {data.sources.map((s, i) => (
            <div key={i} className="bg-gray-800 px-3 py-1 rounded">
              <p className="font-medium text-gray-300">{s.title}</p>
              {s.page && <p>Page: {s.page}</p>}
              {s.content && <p>{s.content}</p>}
              <p className="text-gray-500 text-xs">{s.source.split("/").pop()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
