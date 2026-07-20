"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import SourceCard from "@/components/chat/SourceCard";
import MessageActions from "./MessageActions";

interface Source {
  document: string;
  chunk?: number;
}

interface Props {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

export default function MessageBubble({
  role,
  content,
  sources = [],
}: Props) {

  const isUser = role === "user";

  return (

    <div className="animate-fade-in">

      {/* Avatar */}

      <div className="mb-2 flex items-center gap-2">

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white font-bold">

          {isUser ? "👤" : "🤖"}

        </div>

        <div className="font-semibold">

          {isUser ? "You" : "IndusBrain AI"}

        </div>

      </div>

      {/* Bubble */}

      <div
        className={`rounded-2xl p-5 shadow-sm ${
          isUser
            ? "ml-12 bg-blue-600 text-white"
            : "ml-12 bg-gray-100"
        }`}
      >

        <article
          className={`prose max-w-none ${
            isUser ? "prose-invert" : ""
          }`}
        >

          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>

        </article>

        {!isUser && (
          <>
            <SourceCard
              sources={sources}
            />

            <MessageActions
              text={content}
            />
          </>
        )}

      </div>

    </div>

  );

}