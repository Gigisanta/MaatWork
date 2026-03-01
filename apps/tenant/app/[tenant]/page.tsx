import { db } from "@maatwork/database";
import { tenants, clients, subscriptions, attendances } from "@maatwork/database/schema";
import { eq, sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@maatwork/ui";

export default async function TenantDashboardPage({ params }: { params: Promise<{ tenant: string }> }) {
  const resolvedParams = await params;
  const tenantSlug = resolvedParams.tenant;
  
  // 1. Fetch Tenant ID from Slug
  const tenantRecord = await db.query.tenants.findFirst({
    where: eq(tenants.slug, tenantSlug),
  });

  if (!tenantRecord) {
    return (
      <div className="p-8 text-center text-red-500">
        <h1 className="text-2xl font-bold">Tenant Not Found</h1>
        <p>No workspace exists for &apos;{tenantSlug}&apos;</p>
      </div>
    );
  }

  // 2. Fetch KPIs using tenantRecord.id
  const totalClientsRes = await db.select({ count: sql<number>`count(*)` }).from(clients).where(eq(clients.tenantId, tenantRecord.id));
  const activeSubsRes = await db.select({ count: sql<number>`count(*)` }).from(subscriptions).where(eq(subscriptions.tenantId, tenantRecord.id));
  const todayAttendancesRes = await db.select({ count: sql<number>`count(*)` }).from(attendances).where(eq(attendances.tenantId, tenantRecord.id));
  
  const totalClients = totalClientsRes[0]?.count || 0;
  const activeSubs = activeSubsRes[0]?.count || 0;
  const todayAttendances = todayAttendancesRes[0]?.count || 0;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Welcome to {tenantRecord.name}</h1>
      <p className="text-muted-foreground">This is your dynamic {tenantRecord.template} dashboard securely isolated.</p>
      
      <div className="grid gap-4 md:grid-cols-3 mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today&apos;s Attendances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAttendances}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
