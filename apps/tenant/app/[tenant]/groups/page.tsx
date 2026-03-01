import { db } from "@maatwork/database";
import { groups, tenants } from "@maatwork/database/schema";
import { eq } from "drizzle-orm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button } from "@maatwork/ui";

export default async function GroupsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const resolvedParams = await params;
  
  const tenantRecord = await db.query.tenants.findFirst({
    where: eq(tenants.slug, resolvedParams.tenant),
  });

  if (!tenantRecord) return <div>Tenant not found</div>;

  const allGroups = await db.select().from(groups).where(eq(groups.tenantId, tenantRecord.id));

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Groups & Classes</h1>
        <Button>Create Class</Button>
      </div>

      <div className="border rounded-md bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allGroups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No classes scheduled yet.
                </TableCell>
              </TableRow>
            ) : (
              allGroups.map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="font-medium">{g.name}</TableCell>
                  <TableCell>Unassigned</TableCell>
                  <TableCell>{g.schedule ? JSON.stringify(g.schedule) : 'TBD'}</TableCell>
                  <TableCell>20</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Manage</Button>
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
