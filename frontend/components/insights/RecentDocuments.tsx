"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { FileText } from "lucide-react";

interface Document {
  id: number;
  filename: string;
  pages: number;
}

interface DashboardData {
  recent_documents: Document[];
}

export default function RecentDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    async function loadDocuments() {
      try {
        const response = await api.get("/dashboard/");
        setDocuments(response.data.recent_documents || []);
      } catch (error) {
        console.error(error);
      }
    }

    loadDocuments();
  }, []);

  return (
    <div className="rounded-2xl border bg-white dark:bg-slate-800 dark:border-slate-700 p-6 shadow-sm">

      <h2 className="text-xl font-semibold mb-6">
        Recent Documents
      </h2>

      {documents.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No documents uploaded yet.
        </p>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-lg border p-4 dark:border-slate-700"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-blue-500" size={20} />
                <div>
                  <p className="font-medium">{doc.filename}</p>
                  <p className="text-sm text-gray-500">
                    {doc.pages} pages
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}