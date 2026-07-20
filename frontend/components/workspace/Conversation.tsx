import CopilotInput from "./CopilotInput";
import ChatWindow from "./ChatWindow";

interface Props {
  question: string;
  setQuestion: (value: string) => void;
  askAI: () => void;
  messages: any[];
  loading: boolean;
}

export default function Conversation({
  question,
  setQuestion,
  askAI,
  messages,
  loading,
}: Props) {
  return (
    <div className="space-y-6">

      <ChatWindow
        messages={messages}
        loading={loading}
      />

      <CopilotInput
        question={question}
        setQuestion={setQuestion}
        askAI={askAI}
      />

    </div>
  );
}