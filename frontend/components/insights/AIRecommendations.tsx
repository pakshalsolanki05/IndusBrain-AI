"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Brain,
  CheckCircle,
  AlertCircle,
  Lightbulb,
} from "lucide-react";

interface DashboardData {
  documents: number;
  pages: number;
  storage_mb: number;
  words: number;
}

export default function AIRecommendations() {
  const [data, setData] = useState<DashboardData>({
    documents: 0,
    pages: 0,
    storage_mb: 0,
    words: 0,
  });

  useEffect(() => {
    async function loadData() {
      const response = await api.get("/dashboard/");
      setData(response.data);
    }

    loadData();
  }, []);

  const recommendations = [];

  if (data.documents < 5) {
    recommendations.push({
      icon: AlertCircle,
      color: "text-amber-500",
      text: "Upload more documents to improve AI knowledge coverage.",
    });
  }

  if (data.pages >= 20) {
    recommendations.push({
      icon: CheckCircle,
      color: "text-green-500",
      text: "Knowledge base contains sufficient document content.",
    });
  }

  if (data.storage_mb < 100) {
    recommendations.push({
      icon: Lightbulb,
      color: "text-blue-500",
      text: "Storage usage is healthy with plenty of available capacity.",
    });
  }

  return (
    <div className="rounded-2xl border bg-white dark:bg-slate-800 dark:border-slate-700 p-6 shadow-sm">

      <div className="flex items-center gap-3 mb-6">
        <Brain className="text-violet-600" />
        <h2 className="text-xl font-semibold">
          AI Recommendations
        </h2>
      </div>

      <div className="space-y-5">

        {recommendations.map((item, index) => {

          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex items-start gap-3"
            >

              <Icon
                size={20}
                className={item.color}
              />

              <p className="text-sm leading-6">
                {item.text}
              </p>

            </div>
          );

        })}

      </div>

    </div>
  );
}