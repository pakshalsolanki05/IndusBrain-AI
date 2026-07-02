"use client";
import { useDashboard } from "@/context/DashboardContext";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface DashboardData {
  documents: number;
  pages: number;
  storage_mb: number;
  words: number;
}

export default function DashboardCards() {
  const { refreshKey } = useDashboard();
  const [data, setData] = useState<DashboardData>({
    documents: 0,
    pages: 0,
    storage_mb: 0,
    words: 0,
  });

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await api.get("/dashboard/");
        setData(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    loadDashboard();
  }, [refreshKey]);

  const cards = [
    {
      title: "Documents",
      value: data.documents,
      color: "bg-blue-50",
    },
    {
      title: "Pages",
      value: data.pages,
      color: "bg-green-50",
    },
    {
      title: "Words",
      value: data.words,
      color: "bg-yellow-50",
    },
    {
      title: "Storage",
      value: `${data.storage_mb} MB`,
      color: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.color} rounded-xl p-6 shadow border`}
        >
          <p className="text-gray-500">{card.title}</p>

          <h2 className="text-3xl font-bold mt-2">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}