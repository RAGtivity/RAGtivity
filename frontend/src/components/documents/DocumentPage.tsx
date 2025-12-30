import { useEffect, useState } from "react";
import { getDocuments, uploadDocument } from "../services/ragApi";

interface Document {
  id: number;
  filename: string;
  chunks: number;
}

export default function DocumentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [included, setIncluded] = useState<Record<number, boolean>>({});

  // Fetch documents from API
  const fetchDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data.documents);
      setIncluded(Object.fromEntries(data.documents.map((d: Document) => [d.id, true])));
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Filtered documents based on search
  const filteredDocs = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = () => setSearchTerm("");
  const toggleInclude = (id: number) => setIncluded((prev) => ({ ...prev, [id]: !prev[id] }));
  const includeAll = () => setIncluded(Object.fromEntries(documents.map((d) => [d.id, true])));
  const excludeAll = () => setIncluded(Object.fromEntries(documents.map((d) => [d.id, false])));
  const removeDocument = (id: number) => {
    setDocuments(documents.filter((d) => d.id !== id));
    setIncluded((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // Upload handler
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      await uploadDocument(files[0]); // only first file
      fetchDocuments(); // refresh list
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div className="w-full h-screen bg-transparent p-8 overflow-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Document Management</h1>
          <p className="text-white/60">Manage your project documents</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 pr-10 bg-transparent border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
              title="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-transparent rounded-lg p-4">
            <h3 className="text-white/80 text-sm font-medium">Total Documents</h3>
            <p className="text-white text-2xl font-bold">{documents.length}</p>
          </div>
          <div className="bg-transparent rounded-lg p-4">
            <h3 className="text-white/80 text-sm font-medium">Included</h3>
            <p className="text-green-400 text-2xl font-bold">{Object.values(included).filter(Boolean).length}</p>
          </div>
          <div className="bg-transparent rounded-lg p-4">
            <h3 className="text-white/80 text-sm font-medium">Excluded</h3>
            <p className="text-red-400 text-2xl font-bold">{Object.values(included).filter((v) => !v).length}</p>
          </div>
        </div>

        {/* Document Table */}
        <div className="bg-transparent rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/20 bg-white/5">
            <div className="col-span-4 text-white font-semibold">Document Name</div>
            <div className="col-span-2 text-white font-semibold text-center">Chunks</div>
            <div className="col-span-4 text-white font-semibold text-center">Included</div>
            <div className="col-span-2 text-white font-semibold text-center">Action</div>
          </div>

          <div className="divide-y divide-white/10">
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                <div className="col-span-4 text-white">{doc.filename}</div>
                <div className="col-span-2 text-white text-center">{doc.chunks}</div>
                <div className="col-span-4 text-white text-center">
                  <input
                    type="checkbox"
                    checked={included[doc.id] || false}
                    onChange={() => toggleInclude(doc.id)}
                    className="accent-green-400"
                  />
                </div>
                <div className="col-span-2 text-white text-center">
                  <button onClick={() => removeDocument(doc.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-white/60">
            Showing {filteredDocs.length} of {documents.length} document{documents.length !== 1 ? "s" : ""}
          </div>
          <div className="flex gap-3">
            <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer">
              Add Document
              <input type="file" onChange={(e) => handleUpload(e.target.files)} className="hidden" />
            </label>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors" onClick={includeAll}>
              Include All
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors" onClick={excludeAll}>
              Exclude All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
