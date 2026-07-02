interface Props {
  messages: any[];
  loading: boolean;
}

export default function ChatWindow({
  messages,
  loading,
}: Props) {

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow">
        <div className="animate-pulse text-blue-600">
          🤖 IndusBrain AI is thinking...
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 shadow text-center">

        <h2 className="text-2xl font-bold">
          🤖 Welcome to IndusBrain AI
        </h2>

        <p className="text-gray-500 mt-3">
          Ask any question about your uploaded industrial documents.
        </p>

      </div>
    );
  }

  return (

    <div className="space-y-6">

      {messages.map((msg, index) => (

        <div
          key={index}
          className={`rounded-xl p-5 shadow ${
            msg.role === "user"
              ? "bg-blue-600 text-white ml-24"
              : "bg-white border mr-24"
          }`}
        >

          {msg.role === "user" ? (

            <>
              <div className="font-bold mb-2">
                👤 You
              </div>

              <p>
                {msg.question}
              </p>
            </>

          ) : (

            <>
              <div className="font-bold mb-3">
                🤖 IndusBrain AI
              </div>

              <pre className="whitespace-pre-wrap leading-7">
                {msg.answer}
              </pre>

              {msg.sources?.length > 0 && (

                <div className="mt-6 border-t pt-4">

                  <h4 className="font-semibold mb-2">
                    Sources
                  </h4>

                  {msg.sources.map((source: any, i: number) => (

                    <div
                      key={i}
                      className="rounded-lg bg-slate-100 p-3 mb-2 text-black"
                    >
                      📄 {source.document}
                    </div>

                  ))}

                </div>

              )}

            </>

          )}

        </div>

      ))}

    </div>

  );

}