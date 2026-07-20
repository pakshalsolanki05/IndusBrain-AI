"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import Conversation from "./Conversation";
import { ChatMessage } from "@/types/chat";
import CopilotInput from "./CopilotInput";

export default function AICopilot() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const response = await api.post("/chat/", {
        question,
      });

      const aiMessage = {
  role: "assistant",
  answer: response.data.answer,
  sources: response.data.sources || [],
};

const userMessage = {
  role: "user",
  question,
};

setMessages((prev) => [
  ...prev,
  userMessage,
  aiMessage,
]);

setQuestion("");
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
  ...prev,
  {
    role: "assistant",
    answer: "Unable to contact AI Copilot.",
    sources: [],
  },
]);
    }

    setLoading(false);
  };

  return (
  <div className="space-y-6">

    <div>
      <h1 className="text-4xl font-bold">
        AI Copilot
      </h1>

      <p className="text-gray-500">
        Ask questions about your uploaded industrial documents.
      </p>
    </div>

    <Conversation
      question={question}
      setQuestion={setQuestion}
      askAI={askAI}
      messages={messages}
      loading={loading}
    />

  </div>
)
};