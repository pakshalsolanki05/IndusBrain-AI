"use client";
import { useDashboard } from "@/context/DashboardContext";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Document } from "@/types/document";

export default function RecentDocuments() {
  const { refreshKey } = useDashboard();
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {

    async function loadDocuments() {

      try {

        const response = await api.get("/dashboard/");

        setDocuments(response.data.recent_documents);

      } catch (error) {

        console.error(error);

      }

    }

    loadDocuments();

  }, [refreshKey]);

  return (

    <div className="bg-white rounded-xl shadow border p-6">

      <h2 className="text-2xl font-bold mb-6">
        Recent Documents
      </h2>

      {documents.length === 0 ? (

        <p className="text-gray-500">
          No documents uploaded.
        </p>

      ) : (

        <div className="space-y-4">

          {documents.map((doc) => (

            <div
              key={doc.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition"
            >

              <h3 className="font-semibold">

                📄 {doc.filename}

              </h3>

              <p className="text-sm text-gray-500">

                {doc.file_type}

              </p>

              <div className="flex gap-6 mt-2 text-sm text-gray-600">

                <span>{doc.pages} Pages</span>

                <span>{doc.words} Words</span>

                <span>{doc.size_kb} KB</span>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}