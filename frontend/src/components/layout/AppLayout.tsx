import { SignedIn, SignedOut } from "@clerk/clerk-react";
import type { ReactNode } from "react";
import Sidebar from "../sidebar/Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#020617] text-gray-200 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col px-6 overflow-auto">
        <SignedOut>
          <p className="text-gray-400 text-lg text-center mt-10">
            Please sign in to use the RAG system.
          </p>
        </SignedOut>

        <SignedIn>
          <div className="flex-1">{children}</div>
        </SignedIn>
      </div>
    </div>
  );
}
