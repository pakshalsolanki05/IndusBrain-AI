"use client";

import DashboardCards from "./DashboardCards";
import RecentDocuments from "./RecentDocuments";
import Insights from "./Insights";

export default function Dashboard() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome to IndusBrain AI
        </p>
      </div>

      <DashboardCards />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <RecentDocuments />

        <Insights />

      </div>

    </div>
  );
}