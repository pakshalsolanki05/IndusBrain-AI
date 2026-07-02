"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import DocumentCard from "./DocumentCard";
import { Document } from "@/types/document";

export default function DocumentList() {

  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {

    api.get("/documents/")
      .then((res) => setDocuments(res.data))
      .catch(console.error);

  }, []);

  return (

    <div className="space-y-4">

      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
        />
      ))}

    </div>

  );

}