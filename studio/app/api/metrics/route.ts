import { NextResponse } from "next/server";
import { db } from "@maatwork/database";
import { apps, users, subscriptions } from "@maatwork/database/schema";
import { count, sum, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [
      [appsCount],
      [usersCount],
      [activeSubs],
      [totalRevenue]
    ] = await Promise.all([
      db.select({ value: count() }).from(apps),
      db.select({ value: count() }).from(users),
      db.select({ value: count() }).from(subscriptions).where(sql`${subscriptions.status} = 'active'`),
      db.select({ value: sum(sql`120000`) }).from(apps), // Simulating revenue calc
    ]);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      metrics: {
        totalApps: appsCount?.value || 0,
        totalUsers: usersCount?.value || 0,
        activeSubscriptions: activeSubs?.value || 0,
        estimatedMRR: totalRevenue?.value || 0,
        systemHealth: "optimal",
        version: "1.0.0"
      }
    });
  } catch (error) {
    console.error("Metrics API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
