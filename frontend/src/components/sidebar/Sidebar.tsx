import { useState } from "react";
import { NavLink } from "react-router-dom";
import AuthHeader from "../auth/AuthHeader";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const linkClass = (isActive: boolean) =>
    `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition ${
      isActive ? "bg-gray-700 text-blue-400" : ""
    }`;

  return (
    <div
      className={`
        flex flex-col bg-gray-800 text-gray-100 transition-all duration-300
        ${isOpen ? "w-64" : "w-16"} min-h-screen shadow-lg
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="m-2 p-2 bg-blue-600 rounded hover:bg-blue-700 flex items-center justify-center"
      >
        {isOpen ? "☰" : "☰"}
      </button>

      {/* Menu Items */}
      <nav className="mt-6 flex flex-col gap-2 flex-1">
        <NavLink to="/chat" className={({ isActive }) => linkClass(isActive)}>
          {isOpen ? "RAGtivity" : "RAG"}
        </NavLink>
        <NavLink
          to="/documents"
          className={({ isActive }) => linkClass(isActive)}
        >
          {isOpen ? "Documents" : "Doc"}
        </NavLink>
      </nav>

      {/* Auth Header at bottom */}
      <div className="mt-auto p-4 self-start">
        <AuthHeader />
      </div>
    </div>
  );
}
