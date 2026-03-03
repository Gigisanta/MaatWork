import { db } from '@maatwork/database';
import { analytics_events, apps } from '@maatwork/database/schema';
import { desc, eq, and, sql, gte } from 'drizzle-orm';

/**
 * Get aggregated business metrics for the Founder Dashboard
 */
export async function getFounderIntelligence() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // 1. Total MRR (Sum of latest mrr.update values)
  const mrrResult = await db
    .select({
      total: sql<number>`COALESCE(SUM(value), 0)`,
    })
    .from(analytics_events)
    .where(
      and(
        eq(analytics_events.eventType, 'mrr.update'),
        gte(analytics_events.createdAt, thirtyDaysAgo),
      ),
    );

  // 2. Event Distribution (Engagement metrics)
  const eventStats = await db
    .select({
      type: analytics_events.eventType,
      count: sql<number>`count(*)`,
    })
    .from(analytics_events)
    .groupBy(analytics_events.eventType)
    .orderBy(desc(sql`count(*)`));

  // 3. Growth Trend (Daily events last 7 days)
  const growthTrend = await db.execute(sql`
    SELECT date_trunc('day', created_at) as day, count(*) as count
    FROM analytics_events
    WHERE created_at > now() - interval '7 days'
    GROUP BY 1
    ORDER BY 1 ASC
  `);

  return {
    mrr: mrrResult[0]?.total || 0,
    eventStats: eventStats as { type: string; count: number }[],
    growthTrend: growthTrend.rows as { day: Date; count: number }[],
  };
}

/**
 * Get app-specific engagement heatmap data
 */
export async function getEngagementHeatmap() {
  const heatmap = await db
    .select({
      appName: apps.name,
      eventCount: sql<number>`count(${analytics_events.id})`,
    })
    .from(apps)
    .leftJoin(analytics_events, eq(apps.id, analytics_events.appId))
    .groupBy(apps.name)
    .orderBy(desc(sql`count(${analytics_events.id})`));

  return heatmap;
}
