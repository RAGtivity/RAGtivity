const RAG_BASE_URL = import.meta.env.VITE_RAG_URL || "http://localhost:8000";

export async function queryRag(question: string) {
  const res = await fetch(`${RAG_BASE_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) throw new Error("RAG query failed");

  return res.json();
}

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${RAG_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");

  return res.json();
}

export async function getDocuments() {
  const res = await fetch(`${RAG_BASE_URL}/documents`, {
    method: "GET",
  });

  if (!res.ok) throw new Error("Failed to fetch documents");

  return res.json();
}
