"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  HardDrive,
  BookOpen,
  Type,
} from "lucide-react";

interface DashboardData {
  storage_mb: number;
  pages: number;
  words: number;
  characters: number;
  average_pages?: number;
}

export default function StorageSummary() {
  const [data, setData] = useState<DashboardData>({
    storage_mb: 0,
    pages: 0,
    words: 0,
    characters: 0,
    average_pages: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const response = await api.get("/dashboard/");
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    loadData();
  }, []);

  return (
    <div className="rounded-2xl border bg-white dark:bg-slate-800 dark:border-slate-700 p-6 shadow-sm">

      <h2 className="text-xl font-semibold mb-6">
        Storage Summary
      </h2>

      <div className="space-y-5">

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <HardDrive size={18} />
            <span>Total Storage</span>
          </div>
          <strong>{data.storage_mb} MB</strong>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen size={18} />
            <span>Total Pages</span>
          </div>
          <strong>{data.pages}</strong>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Type size={18} />
            <span>Total Words</span>
          </div>
          <strong>{data.words.toLocaleString()}</strong>
        </div>

        <div className="flex justify-between items-center">
          <span>Average Pages / Document</span>
          <strong>{data.average_pages ?? 0}</strong>
        </div>

      </div>

    </div>
  );
}