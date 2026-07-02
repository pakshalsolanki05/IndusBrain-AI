"use client";

export default function Insights() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow">

      <h2 className="text-xl font-bold mb-4">
        System Insights
      </h2>

      <div className="space-y-3">

        <div className="flex justify-between">
          <span>Backend</span>
          <span className="text-green-600">Online</span>
        </div>

        <div className="flex justify-between">
          <span>Vector DB</span>
          <span className="text-green-600">Connected</span>
        </div>

        <div className="flex justify-between">
          <span>Embedding Model</span>
          <span>MiniLM-L6-v2</span>
        </div>

        <div className="flex justify-between">
          <span>Database</span>
          <span>SQLite</span>
        </div>

      </div>

    </div>
  );
}
