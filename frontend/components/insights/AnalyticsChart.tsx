"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface DashboardData {
  pages: number;
  words: number;
  characters: number;
}

export default function AnalyticsChart() {
  const [data, setData] = useState<DashboardData>({
    pages: 0,
    words: 0,
    characters: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const response = await api.get("/dashboard/");
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    loadData();
  }, []);

  const chartData = [
    {
      name: "Pages",
      value: data.pages,
    },
    {
      name: "Words",
      value: data.words,
    },
    {
      name: "Characters",
      value: data.characters,
    },
  ];

  return (
    <div className="rounded-2xl border bg-white dark:bg-slate-800 dark:border-slate-700 p-6 shadow-sm">

      <h2 className="text-xl font-semibold mb-6">
        Document Analytics
      </h2>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={chartData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}