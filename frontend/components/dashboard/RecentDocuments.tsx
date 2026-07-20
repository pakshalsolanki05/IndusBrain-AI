"use client";

import { useDashboard } from "@/context/DashboardContext";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Document } from "@/types/document";
import Link from "next/link";
import {
  FileText,
  ExternalLink,
  FileSpreadsheet,
  FileArchive,
} from "lucide-react";

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

  function getIcon(type: string) {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="text-red-500" size={22} />;

      case "xlsx":
      case "xls":
        return (
          <FileSpreadsheet
            className="text-green-600"
            size={22}
          />
        );

      default:
        return (
          <FileArchive
            className="text-blue-500"
            size={22}
          />
        );
    }
  }

  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300

        dark:border-slate-700
        dark:bg-slate-800
      "
    >
      <div className="mb-6 flex items-center justify-between">

        <h2
          className="
            text-2xl
            font-bold
            text-slate-900

            dark:text-white
          "
        >
          Recent Documents
        </h2>

        <Link
          href="/documents"
          className="
            text-sm
            font-semibold
            text-blue-600

            hover:text-blue-700

            dark:text-blue-400
            dark:hover:text-blue-300
          "
        >
          View All →
        </Link>

      </div>

      {documents.length === 0 ? (

        <div
          className="
            py-12
            text-center
            text-gray-500

            dark:text-slate-400
          "
        >
          No documents uploaded yet.
        </div>

      ) : (

        <div className="space-y-4">

          {documents.map((doc) => (

            <div
              key={doc.id}
              className="
                group
                rounded-xl
                border
                border-gray-200
                p-4

                transition-all
                duration-300

                hover:border-blue-300
                hover:shadow-md

                dark:border-slate-700
                dark:bg-slate-900
                dark:hover:border-blue-500
              "
            >

              <div className="flex items-start justify-between">

                <div className="flex gap-4">

                  <div
                    className="
                      rounded-xl
                      bg-slate-100
                      p-3

                      dark:bg-slate-700
                    "
                  >
                    {getIcon(doc.file_type)}
                  </div>

                  <div>

                    <h3
                      className="
                        font-semibold
                        text-slate-800

                        dark:text-white
                      "
                    >
                      {doc.filename}
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-gray-500

                        dark:text-slate-400
                      "
                    >
                      {doc.file_type}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3">

                      <span
                        className="
                          rounded-full
                          bg-slate-100
                          px-3
                          py-1
                          text-xs

                          dark:bg-slate-700
                          dark:text-slate-200
                        "
                      >
                        📄 {doc.pages} Pages
                      </span>

                      <span
                        className="
                          rounded-full
                          bg-slate-100
                          px-3
                          py-1
                          text-xs

                          dark:bg-slate-700
                          dark:text-slate-200
                        "
                      >
                        📝 {doc.words} Words
                      </span>

                      <span
                        className="
                          rounded-full
                          bg-slate-100
                          px-3
                          py-1
                          text-xs

                          dark:bg-slate-700
                          dark:text-slate-200
                        "
                      >
                        💾 {doc.size_kb} KB
                      </span>

                    </div>

                  </div>

                </div>

                <Link
                  href={`/documents/${doc.id}`}
                  className="
                    opacity-0
                    transition

                    group-hover:opacity-100
                  "
                >
                  <ExternalLink
                    size={22}
                    className="
                      text-blue-600

                      dark:text-blue-400
                    "
                  />
                </Link>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}