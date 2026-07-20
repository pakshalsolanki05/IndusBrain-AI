"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  function handleSend() {
    if (!message.trim() || disabled) return;

    onSend(message.trim());
    setMessage("");
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex items-end gap-3">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={2}
        placeholder="Ask anything about your enterprise documents..."
        className="
          flex-1
          resize-none
          rounded-xl
          border
          border-slate-300
          p-3
          outline-none
          focus:border-blue-500
          dark:border-slate-700
          dark:bg-slate-800
          dark:text-white
        "
      />

      <button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-xl
          bg-blue-600
          text-white
          transition
          hover:bg-blue-700
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        <Send size={20} />
      </button>
    </div>
  );
}