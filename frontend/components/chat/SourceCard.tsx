"use client";

import Link from "next/link";
import {
  ExternalLink,
  FileText,
  BadgeCheck,
} from "lucide-react";

interface Source {
  document: string;
  chunk: number;
  page?: number;
  document_id?: number;
}

interface Props {
  sources: Source[];
}

export default function SourceCard({
  sources,
}: Props) {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div
      className="
        mt-6
        rounded-2xl
        border
        border-blue-200
        bg-blue-50
        p-5

        transition-all
        duration-300

        dark:border-slate-700
        dark:bg-slate-800
      "
    >
      {/* Header */}

      <div className="mb-4 flex items-center gap-2">

        <FileText
          size={20}
          className="
            text-blue-600
            dark:text-blue-400
          "
        />

        <h4
          className="
            text-lg
            font-semibold
            text-blue-900

            dark:text-white
          "
        >
          Sources
        </h4>

      </div>

      {/* Sources */}

      <div className="space-y-4">

        {sources.map((source, index) => (

          <div
            key={index}
            className="
              rounded-xl
              border
              border-blue-200
              bg-white
              p-4

              transition-all
              duration-300

              hover:shadow-md
              hover:border-blue-400

              dark:border-slate-600
              dark:bg-slate-900
              dark:hover:border-blue-500
            "
          >

            {/* Document */}

            <div className="flex items-start justify-between gap-4">

              <div>

                <p
                  className="
                    font-semibold
                    text-slate-800

                    dark:text-white
                  "
                >
                  📄 {source.document}
                </p>

                <div className="mt-2 space-y-1 text-sm text-gray-500 dark:text-slate-400">

                  {source.page && (
                    <p>📍 Page {source.page}</p>
                  )}

                  <p>📑 Chunk #{source.chunk + 1}</p>

                </div>

              </div>

              {source.document_id && (

                <Link
                  href={`/documents/${source.document_id}`}
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
                    duration-300

                    hover:bg-blue-700
                    hover:shadow-lg
                  "
                >

                  <ExternalLink size={16} />

                  Open

                </Link>

              )}

            </div>

            {/* Footer */}

            <div
              className="
                mt-4
                flex
                items-center
                gap-2

                border-t
                pt-3

                text-xs
                text-green-600

                dark:border-slate-700
                dark:text-green-400
              "
            >

              <BadgeCheck size={16} />

              Verified Citation

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}