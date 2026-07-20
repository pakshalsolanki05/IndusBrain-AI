"use client";

import { useDashboard } from "@/context/DashboardContext";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  FileText,
  Files,
  BookOpen,
  HardDrive,
} from "lucide-react";

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
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Pages",
      value: data.pages,
      icon: Files,
      color: "from-emerald-500 to-green-500",
    },
    {
      title: "Words",
      value: data.words.toLocaleString(),
      icon: BookOpen,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Storage",
      value: `${data.storage_mb} MB`,
      icon: HardDrive,
      color: "from-violet-500 to-purple-500",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => {

        const Icon = card.icon;

        return (

          <div
            key={card.title}
            className="
              group
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-6
              shadow-sm

              transition-all
              duration-300

              hover:-translate-y-1
              hover:shadow-xl

              dark:border-slate-700
              dark:bg-slate-800
              dark:hover:border-slate-600
              dark:hover:shadow-2xl
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p
                  className="
                    text-sm
                    text-gray-500

                    dark:text-slate-400
                  "
                >
                  {card.title}
                </p>

                <h2
                  className="
                    mt-3
                    text-4xl
                    font-bold
                    text-slate-800

                    dark:text-white
                  "
                >
                  {card.value}
                </h2>

              </div>

              <div
                className={`
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  ${card.color}
                  text-white
                  shadow-lg
                `}
              >
                <Icon size={30} />
              </div>

            </div>

            <div
              className="
                mt-6
                h-2
                overflow-hidden
                rounded-full
                bg-gray-100

                dark:bg-slate-700
              "
            >

              <div
                className={`h-full w-3/4 rounded-full bg-gradient-to-r ${card.color}`}
              />

            </div>

          </div>

        );

      })}

    </div>
  );
}