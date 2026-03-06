import { db } from "@maatwork/database";
import { apps, users, app_invoices } from "@maatwork/database/schema";
import { count, sql } from "drizzle-orm";

async function runCurrent() {
  const start = performance.now();
  const [counts, invoicesList] = await Promise.all([
    Promise.all([
      db.select({ count: count() }).from(apps),
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(apps).where(sql`${apps.githubRepo} IS NOT NULL`),
      db.select({ count: count() }).from(apps).where(sql`${apps.vercelUrl} IS NOT NULL`),
    ]),
    db.select({ amount: app_invoices.amount, status: app_invoices.status }).from(app_invoices),
  ]);
  const end = performance.now();
  return end - start;
}

async function runOptimized() {
  const start = performance.now();
  const [
    [appsStats],
    [usersStats],
    invoicesList,
  ] = await Promise.all([
    db.select({
      total: count(),
      githubCount: sql<number>`count(*) filter (where ${apps.githubRepo} is not null)::int`,
      vercelCount: sql<number>`count(*) filter (where ${apps.vercelUrl} is not null)::int`,
    }).from(apps),
    db.select({ count: count() }).from(users),
    db.select({ amount: app_invoices.amount, status: app_invoices.status }).from(app_invoices),
  ]);
  const end = performance.now();
  return end - start;
}

async function benchmark() {
  console.log("Warming up...");
  for (let i = 0; i < 5; i++) {
    await runCurrent();
    await runOptimized();
  }

  const iterations = 50;

  console.log(`\nRunning baseline (${iterations} iterations)...`);
  let currentTotal = 0;
  for (let i = 0; i < iterations; i++) {
    currentTotal += await runCurrent();
  }
  const currentAvg = currentTotal / iterations;
  console.log(`Baseline Average: ${currentAvg.toFixed(2)}ms`);

  console.log(`\nRunning optimized (${iterations} iterations)...`);
  let optimizedTotal = 0;
  for (let i = 0; i < iterations; i++) {
    optimizedTotal += await runOptimized();
  }
  const optimizedAvg = optimizedTotal / iterations;
  console.log(`Optimized Average: ${optimizedAvg.toFixed(2)}ms`);

  const improvement = ((currentAvg - optimizedAvg) / currentAvg) * 100;
  console.log(`\nImprovement: ${improvement.toFixed(2)}%`);

  process.exit(0);
}

benchmark().catch(console.error);
