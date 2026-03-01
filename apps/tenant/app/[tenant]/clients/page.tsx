import { db } from "@maatwork/database";
import { clients, tenants } from "@maatwork/database/schema";
import { eq } from "drizzle-orm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button } from "@maatwork/ui";

export default async function ClientsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const resolvedParams = await params;
  
  // Resolve tenant ID
  const tenantRecord = await db.query.tenants.findFirst({
    where: eq(tenants.slug, resolvedParams.tenant),
  });

  if (!tenantRecord) return <div>Tenant not found</div>;

  // Real data fetch
  const allClients = await db.select().from(clients).where(eq(clients.tenantId, tenantRecord.id));

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Clients Management</h1>
        <Button>Add Client</Button>
      </div>

      <div className="border rounded-md bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No clients registered yet.
                </TableCell>
              </TableRow>
            ) : (
              allClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.id.substring(0,8)}</TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email || 'N/A'}</TableCell>
                  <TableCell>{client.phone || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
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
