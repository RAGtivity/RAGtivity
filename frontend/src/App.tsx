import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ChatBox from "./components/chat/ChatBox";
import DocumentPage from "./components/documents/DocumentPage";

function App() {
  return (
    <AppLayout>
      <Routes>
        {/* Default redirect to /chat */}
        <Route path="/" element={<Navigate to="/chat" />} />

        <Route path="/chat" element={<ChatBox />} />
        <Route path="/documents" element={<DocumentPage />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
