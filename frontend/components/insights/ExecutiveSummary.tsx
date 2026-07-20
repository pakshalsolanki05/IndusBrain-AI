"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Sparkles } from "lucide-react";

interface DashboardData {
  documents: number;
  pages: number;
  words: number;
  storage_mb: number;
}

export default function ExecutiveSummary() {

  const [data, setData] = useState<DashboardData>({
    documents: 0,
    pages: 0,
    words: 0,
    storage_mb: 0,
  });

  useEffect(() => {

    async function loadData() {

      const response = await api.get("/dashboard/");

      setData(response.data);

    }

    loadData();

  }, []);

  return (

    <div className="rounded-2xl border bg-white dark:bg-slate-800 dark:border-slate-700 p-6 shadow-sm">

      <div className="flex items-center gap-3 mb-6">

        <Sparkles className="text-indigo-600" />

        <h2 className="text-xl font-semibold">
          Executive Summary
        </h2>

      </div>

      <p className="leading-8 text-gray-700 dark:text-slate-300">

        Your enterprise knowledge base currently contains{" "}
        <strong>{data.documents}</strong> documents comprising{" "}
        <strong>{data.pages}</strong> pages and{" "}
        <strong>{data.words.toLocaleString()}</strong> indexed words.

        <br /><br />

        AI analysis indicates a healthy knowledge repository with
        <strong> {data.storage_mb} MB </strong>
        of storage usage.

        <br /><br />

        The platform is ready to provide intelligent document retrieval,
        semantic search, AI-assisted question answering, and enterprise
        knowledge discovery.

      </p>

    </div>

  );

}