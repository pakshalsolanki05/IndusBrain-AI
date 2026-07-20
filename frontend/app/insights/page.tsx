import AppLayout from "@/components/layout/AppLayout";

import DashboardCards from "@/components/dashboard/DashboardCards";
import AIRecommendations from "@/components/insights/AIRecommendations";
import ExecutiveSummary from "@/components/insights/ExecutiveSummary";
import AnalyticsChart from "@/components/insights/AnalyticsChart";
import RecentDocuments from "@/components/insights/RecentDocuments";
import StorageSummary from "@/components/insights/StorageSummary";

export default function InsightsPage() {
  return (
    <AppLayout>

      <div className="space-y-8">

        <div>

          <h1 className="text-4xl font-bold">
            AI Insights
          </h1>

          <p className="text-slate-500">
            AI-generated document analytics and business insights.
          </p>

        </div>

        <DashboardCards />

        <AnalyticsChart />

        <div className="grid lg:grid-cols-2 gap-6">

          <RecentDocuments />

          <StorageSummary />

        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          <AIRecommendations />

          <ExecutiveSummary />

        </div>

      </div>

    </AppLayout>
  );
}