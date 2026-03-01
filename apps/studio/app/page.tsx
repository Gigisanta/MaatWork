import { db } from "@maatwork/database";
import { tenants, users } from "@maatwork/database/schema";
import { count } from "drizzle-orm";

export default async function StudioHomePage() {
  const [tenantsData] = await db.select({ count: count() }).from(tenants);
  const [usersData] = await db.select({ count: count() }).from(users);

  // MRR is simulated for now until we build HQ billing
  const simulatedMRR = tenantsData.count * 120000; // e.g. 120k ARS per tenant

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI Cards */}
        <div className="border rounded-lg p-6 bg-card shadow-sm">
          <h3 className="font-semibold text-sm text-muted-foreground">MRR (ARS)</h3>
          <div className="text-2xl font-bold mt-2">${simulatedMRR.toLocaleString()}</div>
        </div>
        <div className="border rounded-lg p-6 bg-card shadow-sm">
          <h3 className="font-semibold text-sm text-muted-foreground">Active Tenants</h3>
          <div className="text-2xl font-bold mt-2">{tenantsData.count}</div>
        </div>
        <div className="border rounded-lg p-6 bg-card shadow-sm">
          <h3 className="font-semibold text-sm text-muted-foreground">Total Users Tracker</h3>
          <div className="text-2xl font-bold mt-2">{usersData.count}</div>
        </div>
        <div className="border rounded-lg p-6 bg-card shadow-sm">
          <h3 className="font-semibold text-sm text-muted-foreground">Open Tickets</h3>
          <div className="text-2xl font-bold mt-2">0</div>
        </div>
      </div>
    </div>
  );
}
