import { db } from "@maatwork/database";
import { tenants } from "@maatwork/database/schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@maatwork/ui";
import { Button } from "@maatwork/ui";
import Link from "next/link";

export default async function TenantsPage() {
  const allTenants = await db.select().from(tenants);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
        <Link href="/tenants/create">
          <Button>Create new tenant</Button>
        </Link>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allTenants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No tenants found.
                </TableCell>
              </TableRow>
            ) : (
              allTenants.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>{t.slug}</TableCell>
                  <TableCell className="capitalize">{t.template}</TableCell>
                  <TableCell>{t.createdAt?.toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Manage</Button>
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
