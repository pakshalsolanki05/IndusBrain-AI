"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Analysis {
  domain: string;
  summary: string;
  insights: string[];
  recommendations: string[];
  analysis_version: string;
}

interface Props {
  documentId: number;
}

export default function AnalysisSummary({
  documentId,
}: Props) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalysis() {
        try {
        console.log("Loading analysis for document:", documentId);

        const response = await api.get(
            `/documents/${documentId}/analysis`
        );

        console.log("Analysis response:", response.data);

        setAnalysis(response.data);

        } catch (error) {
        console.error("Analysis Error:", error);
        } finally {
        setLoading(false);
        }
    }

    loadAnalysis();
  }, [documentId]);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6">
        Loading AI Analysis...
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="rounded-xl border bg-white p-6">
        No AI analysis available.
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm p-6 space-y-6">

      <div>

        <h2 className="text-2xl font-bold">
          Executive Summary
        </h2>

        <p className="mt-3 text-slate-600">
          {analysis.summary}
        </p>

      </div>

      <div>

        <h3 className="font-semibold text-lg">
          Domain
        </h3>

        <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-blue-700 mt-2">
          {analysis.domain}
        </span>

      </div>

      <div>

        <h3 className="font-semibold text-lg">
          AI Insights
        </h3>

        <ul className="list-disc ml-5 mt-2 space-y-2">
          {analysis.insights.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

      </div>

      <div>

        <h3 className="font-semibold text-lg">
          Recommendations
        </h3>

        <ul className="list-disc ml-5 mt-2 space-y-2">
          {analysis.recommendations.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

      </div>

    </div>
  );
}