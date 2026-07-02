export interface Source {
  document: string;
  chunk: number;
}

export interface UserMessage {
  role: "user";
  question: string;
}

export interface AssistantMessage {
  role: "assistant";
  answer: string;
  sources: Source[];
}

export type ChatMessage = UserMessage | AssistantMessage;