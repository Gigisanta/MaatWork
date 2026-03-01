import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button } from "@maatwork/ui";
import { db } from "@maatwork/database";
import { tenants } from "@maatwork/database/schema";

export default async function BillingPage() {
  const allTenants = await db.select().from(tenants);
  const mrr = allTenants.length * 35000;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Billing & Invoices</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated MRR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mrr.toLocaleString("es-AR")} ARS</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allTenants.length}</div>
            <p className="text-xs text-muted-foreground">Tenants running smoothly</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allTenants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No billing data
                </TableCell>
              </TableRow>
            ) : (
              allTenants.map((t, i) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${i % 3 === 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {i % 3 === 0 ? 'Pending' : 'Paid'}
                    </span>
                  </TableCell>
                  <TableCell>$35,000 ARS</TableCell>
                  <TableCell>{new Date().toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View Invoice</Button>
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
