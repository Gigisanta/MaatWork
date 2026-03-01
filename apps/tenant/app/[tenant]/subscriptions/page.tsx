import { db } from "@maatwork/database";
import { subscriptions, tenants } from "@maatwork/database/schema";
import { eq } from "drizzle-orm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button } from "@maatwork/ui";

export default async function SubscriptionsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const resolvedParams = await params;
  
  const tenantRecord = await db.query.tenants.findFirst({
    where: eq(tenants.slug, resolvedParams.tenant),
  });

  if (!tenantRecord) return <div>Tenant not found</div>;

  const allSubs = await db.select().from(subscriptions).where(eq(subscriptions.tenantId, tenantRecord.id));

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
        <Button>New Subscription</Button>
      </div>

      <div className="border rounded-md bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client ID</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allSubs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No active subscriptions.
                </TableCell>
              </TableRow>
            ) : (
              allSubs.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.clientId.substring(0,8)}</TableCell>
                  <TableCell>{sub.plan}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {sub.status}
                    </span>
                  </TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Renew</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
