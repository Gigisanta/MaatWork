import { db } from "@maatwork/database";
import { app_invoices, app_subscriptions } from "@maatwork/database/schema";
import { eq, desc } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge
} from "@maatwork/ui";
import { CreditCard, Receipt } from "lucide-react";

export async function AppBillingDetail({ appId }: { appId: string }) {
  const invoices = await db.select().from(app_invoices).where(eq(app_invoices.appId, appId)).orderBy(desc(app_invoices.createdAt));
  const subscription = await db.query.app_subscriptions.findFirst({
    where: eq(app_subscriptions.appId, appId),
    orderBy: [desc(app_subscriptions.createdAt)]
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-white/5 bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white/40 uppercase tracking-widest flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Suscripción Activa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-bold">{subscription?.planId || 'Standard Plan'}</p>
                <p className="text-xs text-muted-foreground mt-1">Próximo cobro: {subscription?.currentPeriodEnd?.toLocaleDateString() || 'N/A'}</p>
              </div>
              <Badge variant={subscription?.status === 'active' ? 'default' : 'destructive'} className="capitalize">
                {subscription?.status || 'inactive'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/5 bg-white/[0.02] overflow-hidden">
        <CardHeader className="bg-white/[0.01] border-b border-white/5">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Historial de Facturación
          </CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="border-white/5">
              <TableHead className="text-[10px] uppercase font-black text-white/40">Monto</TableHead>
              <TableHead className="text-[10px] uppercase font-black text-white/40">Estado</TableHead>
              <TableHead className="text-[10px] uppercase font-black text-white/40">Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground italic text-sm">
                  No se registran facturas para este centro.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv) => (
                <TableRow key={inv.id} className="border-white/5">
                  <TableCell className="font-bold">${Number(inv.amount).toLocaleString()} {inv.currency}</TableCell>
                  <TableCell>
                    <Badge variant={inv.status === 'paid' ? 'default' : 'outline'} className="text-[10px] uppercase">
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-white/40">{inv.createdAt?.toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
