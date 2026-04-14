import { Suspense } from "react";
import { MetricCard } from "./components/MetricCard";
import { TopPagesChart } from "./components/TopPagesChart";
import { HourlyDistributionChart } from "./components/HourlyDistributionChart";
import { CrudOperationsCard } from "./components/CrudOperationsCard";
import { RecentEventsTable } from "./components/RecentEventsTable";
import { StatsSkeleton } from "./components/StatsSkeleton";

export const dynamic = "force-dynamic";

async function AnalyticsData({ period }: { period: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/analytics/stats?period=${period}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch analytics data");
  }

  return response.json();
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const period = (params.period as string) || "7d";

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Dashboard de Métricas
          </h1>
          <p className="text-gray-600">
            Acompanhe o desempenho e utilização do sistema
          </p>
        </div>

        {/* Period Selector */}
        <div className="mb-6 flex gap-2">
          {["24h", "7d", "30d", "all"].map((p) => (
            <a
              key={p}
              href={`?period=${p}`}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                period === p
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {p === "24h"
                ? "24 horas"
                : p === "7d"
                  ? "7 dias"
                  : p === "30d"
                    ? "30 dias"
                    : "Tudo"}
            </a>
          ))}
        </div>

        <Suspense fallback={<StatsSkeleton />}>
          <AnalyticsContent period={period} />
        </Suspense>
      </div>
    </div>
  );
}

async function AnalyticsContent({ period }: { period: string }) {
  const data = await AnalyticsData({ period });

  return (
    <>
      {/* KPIs Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Page Views"
          value={data.totalPageViews.toLocaleString()}
          icon="👁️"
          description={`nos últimos ${
            period === "24h" ? "1 dia" : period === "7d" ? "7 dias" : "30 dias"
          }`}
        />
        <MetricCard
          title="Total Bandas"
          value={data.businessMetrics.totalBands.toLocaleString()}
          icon="🎸"
          description="no sistema"
        />
        <MetricCard
          title="Total Trilhas"
          value={data.businessMetrics.totalTracks.toLocaleString()}
          icon="🎵"
          description="no sistema"
        />
        <MetricCard
          title="Taxa de Erros"
          value={`${data.errorStats.rate.toFixed(2)}%`}
          icon="❌"
          description={`${data.errorStats.total} erros`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* CRUD Operations */}
        <CrudOperationsCard operations={data.crudOperations} />

        {/* Hourly Distribution */}
        <HourlyDistributionChart data={data.hourlyDistribution} />
      </div>

      {/* Top Pages */}
      <div className="mb-8">
        <TopPagesChart pages={data.topPages} />
      </div>

      {/* Recent Events */}
      <div>
        <RecentEventsTable events={data.recentEvents} />
      </div>
    </>
  );
}
