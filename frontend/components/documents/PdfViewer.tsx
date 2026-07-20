"use client";

import { ExternalLink, FileText } from "lucide-react";

interface Props {
  filename: string;
}

export default function PdfViewer({
  filename,
}: Props) {
  return (
    <div
      className="
        h-full
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-sm

        transition-all
        duration-300

        dark:border-slate-700
        dark:bg-slate-800
      "
    >
      {/* Toolbar */}

      <div
        className="
          flex
          items-center
          justify-between

          border-b
          border-gray-200

          px-6
          py-4

          dark:border-slate-700
        "
      >
        <div className="flex items-center gap-3">

          <div
            className="
              rounded-xl
              bg-blue-100
              p-3

              dark:bg-blue-900/30
            "
          >
            <FileText
              size={22}
              className="
                text-blue-700

                dark:text-blue-300
              "
            />
          </div>

          <div>

            <h2
              className="
                text-2xl
                font-bold
                text-slate-900

                dark:text-white
              "
            >
              PDF Viewer
            </h2>

            <p
              className="
                text-sm
                text-gray-500

                dark:text-slate-400
              "
            >
              Preview the uploaded document
            </p>

          </div>

        </div>

        <a
          href={`http://127.0.0.1:8000/uploads/${filename}`}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex
            items-center
            gap-2

            rounded-xl
            bg-blue-600

            px-5
            py-2.5

            text-sm
            font-semibold
            text-white

            shadow-md

            transition-all
            duration-300

            hover:bg-blue-700
            hover:shadow-lg
          "
        >
          <ExternalLink size={16} />

          Open in New Tab

        </a>

      </div>

      {/* PDF */}

      <div
        className="
          h-[900px]
          bg-slate-100

          dark:bg-slate-900
        "
      >
        <iframe
          src={`http://127.0.0.1:8000/uploads/${filename}`}
          title="Document Viewer"
          className="
            h-full
            w-full
            border-0
          "
        />
      </div>

    </div>
  );
}