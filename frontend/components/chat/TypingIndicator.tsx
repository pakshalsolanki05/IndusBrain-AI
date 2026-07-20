"use client";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 py-2">

      <span
        className="h-3 w-3 rounded-full bg-gray-400 animate-bounce"
        style={{ animationDelay: "0ms" }}
      />

      <span
        className="h-3 w-3 rounded-full bg-gray-400 animate-bounce"
        style={{ animationDelay: "150ms" }}
      />

      <span
        className="h-3 w-3 rounded-full bg-gray-400 animate-bounce"
        style={{ animationDelay: "300ms" }}
      />

    </div>
  );
}