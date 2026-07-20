export interface Source {
  document: string;
  chunk: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

export interface CopilotResponse {
  answer: string;
  sources: Source[];
}