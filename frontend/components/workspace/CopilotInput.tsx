interface Props {
  question: string;
  setQuestion: (value: string) => void;
  askAI: () => void;
}

export default function CopilotInput({
  question,
  setQuestion,
  askAI,
}: Props) {
  return (
    <div className="rounded-xl bg-white border shadow p-5 space-y-4">

      <textarea
        className="w-full h-40 resize-none border rounded-lg p-4 outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Ask anything about your industrial documents..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <div className="flex justify-end">

        <button
          onClick={askAI}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Ask AI
        </button>

      </div>

    </div>
  );
}