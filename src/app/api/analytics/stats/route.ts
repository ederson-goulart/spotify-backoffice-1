import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
interface AnalyticsMetadata {
  ip?: string;
  country?: string;
  city?: string;
  region?: string;
  isp?: string;
  userAgent?: string;
  [key: string]: string | number | boolean | null | undefined;
}
/**
 * GET /api/analytics/stats
 * Retorna estatísticas agregadas de analytics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d"; // "24h", "7d", "30d", "all"
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Calcular data de início baseada no período
    let startDate = new Date();
    if (period === "24h") {
      startDate.setHours(startDate.getHours() - 24);
    } else if (period === "7d") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === "30d") {
      startDate.setDate(startDate.getDate() - 30);
    } else {
      startDate = new Date(0); // Retorna tudo
    }

    // Page Views totais
    const totalPageViews = await prisma.analyticsEvent.count({
      where: {
        type: "PAGE_VIEW",
        timestamp: { gte: startDate },
      },
    });

    // CRUD Operations
    const crudEvents = await prisma.analyticsEvent.groupBy({
      by: ["type"],
      where: {
        type: {
          in: [
            "CREATE_BAND",
            "UPDATE_BAND",
            "DELETE_BAND",
            "CREATE_TRACK",
            "UPDATE_TRACK",
            "DELETE_TRACK",
          ],
        },
        timestamp: { gte: startDate },
      },
      _count: true,
    });

    // Páginas mais visitadas
    const topPages = await prisma.analyticsEvent.groupBy({
      by: ["page"],
      where: {
        type: "PAGE_VIEW",
        timestamp: { gte: startDate },
      },
      _count: true,
      orderBy: {
        _count: {
          page: "desc",
        },
      },
      take: 5,
    });

    // Distribuição horária (últimas 24h)
    const last24h = new Date();
    last24h.setHours(last24h.getHours() - 24);

    const hourlyDistribution = await prisma.analyticsEvent.findMany({
      where: {
        type: "PAGE_VIEW",
        timestamp: { gte: last24h },
      },
      select: {
        timestamp: true,
      },
    });

    // Contar por hora
    const hourlyData = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date();
      hour.setHours(hour.getHours() - (23 - i), 0, 0, 0);
      const hourStart = new Date(hour);
      const hourEnd = new Date(hour);
      hourEnd.setHours(hourEnd.getHours() + 1);

      const count = hourlyDistribution.filter(
        (event) => event.timestamp >= hourStart && event.timestamp < hourEnd,
      ).length;

      return {
        hour: hour.getHours(),
        count,
      };
    });

    // Eventos recentes com paginação
    const recentEvents = await prisma.analyticsEvent.findMany({
      orderBy: {
        timestamp: "desc",
      },
      take: limit,
      skip: (page - 1) * limit,
      select: {
        id: true,
        type: true,
        page: true,
        action: true,
        timestamp: true,
        metadata: true,
      },
    });

    // Total de eventos recentes para paginação
    const totalRecentEvents = await prisma.analyticsEvent.count();

    // Taxa de erros
    const totalEvents = await prisma.analyticsEvent.count({
      where: {
        timestamp: { gte: startDate },
      },
    });

    const errorCount = await prisma.analyticsEvent.count({
      where: {
        type: "ERROR",
        timestamp: { gte: startDate },
      },
    });

    const errorRate =
      totalEvents > 0 ? ((errorCount / totalEvents) * 100).toFixed(2) : "0";

    // Total de Bandas e Trilhas
    const bandCount = await prisma.band.count();
    const trackCount = await prisma.track.count();

    return NextResponse.json({
      period,
      startDate,
      totalPageViews,
      crudOperations: crudEvents.reduce(
        (acc, item) => {
          acc[item.type] = item._count;
          return acc;
        },
        {} as Record<string, number>,
      ),
      topPages: topPages.map((item) => ({
        page: item.page,
        count: item._count,
      })),
      hourlyDistribution: hourlyData,
      recentEvents: recentEvents.map((event) => {
        const metadata = event.metadata as AnalyticsMetadata;
        return {
          id: event.id,
          type: event.type,
          page: event.page,
          action: event.action,
          timestamp: event.timestamp,
          ip: metadata?.ip || null,
          country: metadata?.country || null,
          city: metadata?.city || null,
          region: metadata?.region || null,
          isp: metadata?.isp || null,
        };
      }),
      recentEventsPagination: {
        page,
        limit,
        total: totalRecentEvents,
        totalPages: Math.ceil(totalRecentEvents / limit),
      },
      errorStats: {
        total: errorCount,
        rate: parseFloat(errorRate.toString()),
      },
      businessMetrics: {
        totalBands: bandCount,
        totalTracks: trackCount,
      },
    });
  } catch (error) {
    console.error("Analytics stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
