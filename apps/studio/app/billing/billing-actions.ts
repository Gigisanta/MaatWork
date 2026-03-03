"use server";

import { db } from "@maatwork/database";
import { app_invoices, apps, activity_logs } from "@maatwork/database/schema";
import { sql, eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@maatwork/auth";

export async function createInvoiceAction(data: { appId: string, amount: string, currency: string }) {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    try {
        const id = crypto.randomUUID();
        await db.insert(app_invoices).values({
            id,
            appId: data.appId,
            amount: data.amount,
            currency: data.currency,
            status: 'open',
        });

        await db.insert(activity_logs).values({
            id: crypto.randomUUID(),
            appId: data.appId,
            userId: session.user.id,
            action: 'INVOICE_CREATED_MANUAL',
            details: { amount: data.amount, currency: data.currency, timestamp: new Date().toISOString() }
        });

        revalidatePath("/billing");
        revalidatePath(`/apps/${data.appId}`);
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}

export async function getGlobalBillingData() {
  const [
    [stats],
    recentInvoices,
    appsData
  ] = await Promise.all([
    db.select({
      totalMRR: sql<number>`COALESCE(sum(${app_invoices.amount}), 0)`,
      paidCount: sql<number>`count(*) FILTER (WHERE ${app_invoices.status} = 'paid')`,
      pendingCount: sql<number>`count(*) FILTER (WHERE ${app_invoices.status} = 'open')`
    }).from(app_invoices),
    db.select({
      id: app_invoices.id,
      amount: app_invoices.amount,
      status: app_invoices.status,
      createdAt: app_invoices.createdAt,
      appName: apps.name
    })
    .from(app_invoices)
    .innerJoin(apps, eq(app_invoices.appId, apps.id))
    .orderBy(desc(app_invoices.createdAt))
    .limit(10),
    db.select({
      id: apps.id,
      name: apps.name,
      mrr: sql<number>`COALESCE((SELECT sum(amount) FROM app_invoices WHERE app_id = apps.id AND status = 'paid'), 0)`
    }).from(apps)
  ]);

  return {
    stats,
    recentInvoices,
    apps: appsData
  };
}
