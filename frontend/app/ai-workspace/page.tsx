"use client";

import { useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import DocumentUpload from "@/components/documents/DocumentUpload";
import AnalysisSummary from "@/components/workspace/AnalysisSummary";

export default function AIWorkspacePage() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);

  return (
    <AppLayout>

      <div className="space-y-8">

        <div>

          <h1 className="text-4xl font-bold">
            AI Workspace
          </h1>

          <p className="mt-2 text-slate-500">
            Upload a document and let AI transform it into structured knowledge.
          </p>

        </div>

        <DocumentUpload
          onUploadSuccess={setSelectedDocumentId}
        />

        {selectedDocumentId && (
          <AnalysisSummary
            documentId={selectedDocumentId}
          />
        )}

      </div>

    </AppLayout>
  );
}