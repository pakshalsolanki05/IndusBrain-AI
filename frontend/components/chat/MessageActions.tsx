"use client";

import {
  Copy,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface Props {
  text: string;
  onRegenerate?: () => void;
}

export default function MessageActions({
  text,
  onRegenerate,
}: Props) {

  const [copied, setCopied] = useState(false);

  async function copyAnswer() {

    try {

      await navigator.clipboard.writeText(text);

      setCopied(true);

      toast.success("Copied to clipboard!", {
        description: "The AI response is ready to paste.",
      });

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch {

      toast.error("Copy failed", {
        description: "Unable to copy the response.",
      });

    }

  }

  return (

    <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-gray-500">

      <button
        onClick={copyAnswer}
        className="flex items-center gap-2 transition hover:text-blue-600"
      >
        <Copy size={16} />
        {copied ? "Copied!" : "Copy"}
      </button>

      {onRegenerate && (

        <button
          onClick={onRegenerate}
          className="flex items-center gap-2 transition hover:text-indigo-600"
        >
          <RotateCcw size={16} />
          Regenerate
        </button>

      )}

      <button
        className="flex items-center gap-2 transition hover:text-green-600"
      >
        <ThumbsUp size={16} />
        Helpful
      </button>

      <button
        className="flex items-center gap-2 transition hover:text-red-600"
      >
        <ThumbsDown size={16} />
        Not Helpful
      </button>

      <div className="ml-auto flex items-center gap-2">
        <Clock size={15} />
        {new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>

    </div>

  );

}