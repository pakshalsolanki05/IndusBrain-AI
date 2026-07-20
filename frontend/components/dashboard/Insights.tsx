"use client";

import {
  CheckCircle2,
  Database,
  Cpu,
  HardDrive,
  Activity,
  Server,
} from "lucide-react";

const services = [
  {
    title: "Backend API",
    value: "Online",
    icon: Server,
    color: "text-green-600",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  {
    title: "Vector Database",
    value: "Connected",
    icon: Database,
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    title: "Embedding Model",
    value: "MiniLM-L6-v2",
    icon: Cpu,
    color: "text-purple-600",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    title: "Database",
    value: "SQLite",
    icon: HardDrive,
    color: "text-orange-600",
    bg: "bg-orange-100 dark:bg-orange-900/30",
  },
];

export default function Insights() {
  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300

        dark:border-slate-700
        dark:bg-slate-800
      "
    >
      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2
            className="
              text-2xl
              font-bold
              text-slate-900

              dark:text-white
            "
          >
            System Health
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500

              dark:text-slate-400
            "
          >
            Current AI infrastructure status
          </p>

        </div>

        <Activity
          size={28}
          className="text-green-500"
        />

      </div>

      {/* Services */}

      <div className="space-y-5">

        {services.map((service) => {

          const Icon = service.icon;

          return (

            <div
              key={service.title}
              className="
                flex
                items-center
                justify-between

                rounded-xl
                border
                border-gray-200

                p-4

                transition-all
                duration-300

                hover:shadow-md
                hover:border-blue-300

                dark:border-slate-700
                dark:bg-slate-900
                dark:hover:border-blue-500
              "
            >

              <div className="flex items-center gap-4">

                <div
                  className={`
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl

                    ${service.bg}
                  `}
                >
                  <Icon
                    size={24}
                    className={service.color}
                  />
                </div>

                <div>

                  <h3
                    className="
                      font-semibold
                      text-slate-800

                      dark:text-white
                    "
                  >
                    {service.title}
                  </h3>

                  <p
                    className="
                      text-sm
                      text-gray-500

                      dark:text-slate-400
                    "
                  >
                    {service.value}
                  </p>

                </div>

              </div>

              <CheckCircle2
                size={24}
                className="text-green-500"
              />

            </div>

          );

        })}

      </div>

      {/* AI Engine */}

      <div
        className="
          mt-8
          rounded-xl
          bg-gradient-to-r
          from-blue-600
          to-indigo-600
          p-5
          text-white
          shadow-lg
        "
      >

        <h3 className="text-lg font-semibold">
          🤖 AI Engine
        </h3>

        <p className="mt-2 text-sm opacity-90 leading-6">
          Retrieval-Augmented Generation (RAG) is active.
          Your assistant is ready to answer questions
          from uploaded documents.
        </p>

      </div>

    </div>
  );
}