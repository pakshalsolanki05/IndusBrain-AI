"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import DocumentCard from "./DocumentCard";

export default function DocumentLibrary() {
  
  const [documents, setDocuments] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const response = await api.get("/documents/");
      setDocuments(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteDocument(id: number) {
    try {
        await api.delete(`/documents/${id}`);

        loadDocuments();

    } catch (err) {
        console.error(err);
    }
  }

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <h1 className="text-4xl font-bold">
          Documents
        </h1>

      </div>

      <div className="grid gap-6">

        {documents.map((document: any) => (

          <DocumentCard
            key={document.id}
            document={document}
            onOpen={() => router.push(`/documents/${document.id}`)}
            onDelete={() => deleteDocument(document.id)}
          />

        ))}

      </div>

    </div>
  );
}