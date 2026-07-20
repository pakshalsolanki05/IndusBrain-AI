"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import {
  Search,
  FileText,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface Result {
  document: string;
  document_id?: number;
  page?: number;
  chunk?: number;
  text: string;
}

export default function GlobalSearch() {
  const [question, setQuestion] = useState("");

  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState("");

  const [results, setResults] = useState<Result[]>([]);

  async function search() {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const response = await api.post(
        "/search/",
        {
          question,
        }
      );

      setSummary(response.data.summary);

      setResults(response.data.results);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">

      <div>

        <h1 className="text-4xl font-bold flex items-center gap-3">

          <Search />

          Global AI Search

        </h1>

        <p className="mt-3 text-gray-500 dark:text-slate-400">

          Search across every uploaded document.

        </p>

      </div>

      <div className="flex gap-4">

        <input
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              search();
            }
          }}
          placeholder="Search your knowledge base..."
          className="
            flex-1
            rounded-xl
            border
            p-4
            dark:bg-slate-800
            dark:border-slate-700
          "
        />

        <button
          onClick={search}
          disabled={loading}
          className="
            rounded-xl
            bg-blue-600
            px-8
            text-white
            hover:bg-blue-700
            disabled:opacity-50
          "
        >

          {loading ? "Searching..." : "Search"}

        </button>

      </div>

      {summary && (

        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">

          <div className="flex items-center gap-2 mb-3">

            <Sparkles />

            <h2 className="text-xl font-semibold">

              AI Summary

            </h2>

          </div>

          <p>{summary}</p>

        </div>

      )}

      <div className="space-y-5">

        {results.map((result, index) => (

          <div
            key={index}
            className="
              rounded-2xl
              border
              bg-white
              p-6
              shadow-sm

              dark:bg-slate-800
              dark:border-slate-700
            "
          >

            <div className="flex justify-between">

              <div>

                <h3 className="font-semibold flex items-center gap-2">

                  <FileText size={18} />

                  {result.document}

                </h3>

                <div className="mt-2 text-sm text-gray-500 dark:text-slate-400">

                  {result.page && (
                    <p>📍 Page {result.page}</p>
                  )}

                  {result.chunk !== undefined && (
                    <p>
                      📑 Chunk {result.chunk + 1}
                    </p>
                  )}

                </div>

              </div>

            </div>

            <p className="mt-5 whitespace-pre-wrap text-gray-700 dark:text-slate-300">

              {result.text}

            </p>
            {result.document_id && (
                <div className="mt-5">

                    <Link
                        href={`/documents/${result.document_id}`}
                        className="
                            inline-flex
                            items-center
                            gap-2

                            rounded-lg
                          bg-blue-600

                            px-4
                            py-2

                            text-sm
                            font-medium
                          text-white

                            transition-all
                          hover:bg-blue-700
                        "
                    >
                        <ExternalLink size={16} />

                        Open Document

                    </Link>

                </div>
            )}

          </div>

        ))}

      </div>

    </div>
  );
}