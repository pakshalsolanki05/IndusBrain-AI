"use client";

import { RefObject } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

interface Source {
  document: string;
  chunk?: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

interface Props {
  messages: Message[];
  loading: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export default function ChatMessages({
  messages,
  loading,
  messagesEndRef,
}: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">

      {messages.map((message, index) => (

        <MessageBubble
          key={index}
          role={message.role}
          content={message.content}
          sources={message.sources}
        />

      ))}

      {loading && <TypingIndicator />}

      <div ref={messagesEndRef} />

    </div>
  );
}