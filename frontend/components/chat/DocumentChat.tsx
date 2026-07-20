"use client";

import TypingIndicator from "./TypingIndicator";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import SourceCard from "@/components/chat/SourceCard";
import MessageActions from "./MessageActions";
import { API_BASE_URL } from "@/lib/api";

interface Props {
  documentId: number;
}

interface Source {
  document: string;
  chunk?: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

export default function DocumentChat({
  documentId,
}: Props) {

  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");

  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] =
    useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const suggestedQuestions = [
    "Summarize this document",
    "What are the objectives?",
    "Explain the workflow",
    "List the key findings",
    "Generate interview questions",
  ];

  useEffect(() => {
    loadMessages();
  }, [documentId]);

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  async function loadMessages() {

    try {

      const response = await api.get(
        `/documents/${documentId}/messages`
      );

      const history: Message[] =
        response.data.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        }));

      setMessages(history);

    } catch (err) {

      console.error(
        "Failed to load chat history:",
        err
      );

    }

  }

  async function askQuestion(
    customQuestion?: string,
    regenerate = false
  ) {

    const currentQuestion =
      customQuestion ?? question;
    setLastQuestion(currentQuestion);

    if (!currentQuestion.trim()) return;

    if (!regenerate) {

      const userMessage: Message = {
        role: "user",
        content: currentQuestion,
      };

      setMessages((prev) => [
        ...prev,
        userMessage,
      ]);

    }

    setQuestion("");
    setLoading(true);

    try {

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
          sources: [],
        },
      ]);
      
      abortControllerRef.current = new AbortController();
      const response = await fetch(
        `${API_BASE_URL}/documents/${documentId}/chat/stream`,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            question: currentQuestion,
          }),

          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(
          "Streaming request failed."
        );
      }

      if (!response.body) {
        throw new Error(
          "Streaming not supported."
        );
      }

      const reader =
        response.body.getReader();

      const decoder =
        new TextDecoder();

      let buffer = "";
      let assistantAnswer = "";
      let sources: Source[] = [];

      while (true) {

        const {
          value,
          done,
        } = await reader.read();

        if (done) break;

        buffer += decoder.decode(
          value,
          {
            stream: true,
          }
        );

        const events =
          buffer.split("\n\n");

        buffer =
          events.pop() || "";

        for (const event of events) {

          if (
            !event.startsWith("data: ")
          )
            continue;

          const payload =
            event.replace(
              "data: ",
              ""
            );

          if (payload === "[DONE]")
            continue;

          const json =
            JSON.parse(payload);

          if (
            json.type === "token"
          ) {

            assistantAnswer +=
              json.content;

            setMessages((prev) => {

              const updated = [
                ...prev,
              ];

              updated[
                updated.length - 1
              ] = {
                role: "assistant",
                content:
                  assistantAnswer,
                sources,
              };

              return updated;

            });

          }

          if (
            json.type === "done"
          ) {

            sources =
              json.sources ?? [];

            setMessages((prev) => {

              const updated = [
                ...prev,
              ];

              updated[
                updated.length - 1
              ] = {
                role: "assistant",
                content:
                  assistantAnswer,
                sources,
              };

              return updated;

            });

          }

        }

      }

    } catch (err) {

        if (
          err instanceof Error &&
          err.name === "AbortError"
        ) {
          toast("Generation stopped", {
            description: "AI response was interrupted.",
          });

          // User intentionally stopped generation.
          // Keep the partial response.
          return;
        }

        console.error(err);
        toast.error("Streaming failed", {
          description: "Unable to generate an AI response.",
        });

        setMessages((prev) => {

          const updated = [...prev];

          updated[updated.length - 1] = {
            role: "assistant",
            content: "❌ Failed to stream response.",
            sources: [],
          };

          return updated;

        });

      } finally {

      setLoading(false);

    }

  }

  async function regenerateAnswer() {

    if (loading) return;

    if (!lastQuestion) return;

    setMessages((prev) => {

      const updated = [...prev];

      // Remove the previous assistant response
      if (
        updated.length &&
        updated[updated.length - 1].role === "assistant"
      ) {
        updated.pop();
      }

      return updated;

    });

    await askQuestion(lastQuestion, true);

  }

  async function generateSummary() {

    const userMessage: Message = {
      role: "user",
      content:
        "Generate a summary of this document.",
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    try {

      setSummaryLoading(true);

      const response =
        await api.post(
          `/documents/${documentId}/summary`
        );

        toast.success("Summary generated!", {
            description: "AI finished summarizing the document.",
        });
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response.data.summary,

          },
        ]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Failed to generate summary.",
        },
      ]);
    } finally {
      setSummaryLoading(false);
    }
  }

  return (
    <div
      className="
        flex
        h-full
        flex-col

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
      {/* Header */}

      <div
        className="
          border-b
        border-gray-200
          p-5

        dark:border-slate-700
        "
      >

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          🤖 AI Assistant
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          Ask questions about this document only.
        </p>

        <div className="mt-4">

          <button
            onClick={generateSummary}
            disabled={summaryLoading || loading}
            className="
              mt-2
              w-full
              rounded-xl

            bg-emerald-600

              py-3

              font-semibold
            text-white

              transition-all
              duration-300

            hover:bg-emerald-700
              hover:shadow-lg

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {summaryLoading
              ? "Generating Summary..."
              : "✨ Generate AI Summary"}
          </button>

        </div>

      </div>

      {/* Chat */}

      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {messages.length === 0 && (

          <div>

            <p className="font-semibold mb-3">
              💡 Suggested Questions
            </p>

            <div className="flex flex-wrap gap-2 mb-6">

              {suggestedQuestions.map((item) => (

                <button
                  key={item}
                  onClick={() => askQuestion(item)}
                  disabled={loading || summaryLoading}
                  className="
                    rounded-full
                    border
                  border-gray-300

                  bg-white

                    px-4
                    py-2

                    text-sm
                    font-medium

                    transition-all
                    duration-300

                  hover:bg-blue-50
                  hover:border-blue-300

                    disabled:opacity-50

                  dark:border-slate-600
                  dark:bg-slate-800
                  dark:text-slate-200
                  dark:hover:bg-slate-700
                  "
                >
                  {item}
                </button>

              ))}

            </div>

            <div className="text-gray-500 dark:text-slate-400">
              No conversation yet.
            </div>

          </div>

        )}

        {messages.map((message, index) => (

          <div
            key={index}
            className="animate-fade-in"
          >

            {/* Avatar */}

            <div className="mb-2 flex items-center gap-2">

              <div 
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center

                  rounded-full

                bg-slate-900
                text-white

                  shadow-md

                dark:bg-slate-700
                "
              >

                {message.role === "user"
                  ? "👤"
                  : "🤖"}

              </div>

              <div className="font-semibold text-slate-900 dark:text-white">

                {message.role === "user"
                  ? "You"
                  : "IndusBrain AI"}

              </div>

            </div>

            {/* Bubble */}

            <div
              className={`
                rounded-2xl
                p-5
                shadow-sm
                transition-all
                duration-300

              ${
                message.role === "user"
                  ? "ml-12 bg-blue-600 text-white"
                  : "ml-12 bg-gray-100 dark:bg-slate-700 dark:text-slate-100"
              }`}
            >

              <article
                className={`
                  prose
                  max-w-none

                  dark:prose-invert

                ${
                  message.role === "user"
                    ? "prose-invert"
                    : ""
                }`}
              >
                {message.role === "assistant" &&
                message.content === "" &&
                loading ? (

                  <TypingIndicator />

                ) : (

                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                >
                  {message.content}
                </ReactMarkdown>
              )}
              </article>

              {message.role === "assistant" && message.content.trim() !== "" && (
                <>
                  <SourceCard
                    sources={message.sources ?? []}
                  />

                  <MessageActions
                    text={message.content}
                    onRegenerate={regenerateAnswer}
                  />
                </>
              )}

            </div>

          </div>

        ))}


        {/* Auto Scroll */}

        <div ref={messagesEndRef} />

      </div>

      {/* Input */}

      <div
        className="
          border-t
        border-gray-200
          p-5

        dark:border-slate-700
        "
      >

        <textarea
          ref={textareaRef}
          rows={3}
          disabled={loading || summaryLoading}
          className="
            w-full

            rounded-xl
            border
          border-gray-300

          bg-white

            p-4

            resize-none

            transition-all

            focus:ring-2
          focus:ring-blue-500

          disabled:bg-gray-100

          dark:border-slate-600
          dark:bg-slate-900
          dark:text-white
          dark:placeholder:text-slate-400
          dark:disabled:bg-slate-800
          "
          placeholder="Ask anything about this document..."
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);

            if (textareaRef.current) {
              textareaRef.current.style.height = "auto";
              textareaRef.current.style.height =
                `${textareaRef.current.scrollHeight}px`;
            }
          }}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey
            ) {
              e.preventDefault();

              if (!loading && !summaryLoading) {
                askQuestion();
              }
            }
          }}
        />

        <div className="mt-3 flex gap-3">

          <button
            onClick={() => askQuestion()}
            disabled={loading || summaryLoading}
            className="flex-1 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            Send
          </button>

          {loading && (
            <button
              onClick={() => abortControllerRef.current?.abort()}
              className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
            >
              Stop
            </button>
          )}

        </div>

      </div>

    </div>
  );
}