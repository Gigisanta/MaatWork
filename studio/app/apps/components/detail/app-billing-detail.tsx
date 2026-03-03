import { db } from '@maatwork/database';
import { app_invoices, app_subscriptions } from '@maatwork/database/schema';
import { eq, desc } from 'drizzle-orm';
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
  Badge,
} from '@maatwork/ui';
import { CreditCard, Receipt } from 'lucide-react';

interface Invoice {
  id: string;
  amount: string;
  currency: string;
  status: string;
  createdAt: Date | null;
}

interface Subscription {
  planId: string | null;
  status: string | null;
  currentPeriodEnd: Date | null;
}

export async function AppBillingDetail({ appId }: { appId: string }) {
  const invoices: Invoice[] = await db
    .select()
    .from(app_invoices)
    .where(eq(app_invoices.appId, appId))
    .orderBy(desc(app_invoices.createdAt));
  const subscription: Subscription | null =
    await db.query.app_subscriptions.findFirst({
      where: eq(app_subscriptions.appId, appId),
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
                <p className="text-2xl font-bold">
                  {subscription?.planId || 'Standard Plan'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Próximo cobro:{' '}
                  {subscription?.currentPeriodEnd?.toLocaleDateString() ||
                    'N/A'}
                </p>
              </div>
              <Badge
                variant={
                  subscription?.status === 'active' ? 'default' : 'destructive'
                }
              >
                {subscription?.status || 'inactive'}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/5 bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white/40 uppercase tracking-widest flex items-center gap-2">
              <Receipt className="w-4 h-4" /> Estado de Facturas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {invoices
                .reduce((sum, inv) => sum + Number(inv.amount), 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total facturado
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/5 bg-white/[0.02]">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-white/40 uppercase tracking-widest flex items-center gap-2">
            <Receipt className="w-4 h-4" /> Historial de Facturas
          </CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="border-white/5">
              <TableHead className="text-white/40">Fecha</TableHead>
              <TableHead className="text-white/40">Monto</TableHead>
              <TableHead className="text-white/40">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground py-8 italic"
                >
                  No hay facturas registradas.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv) => (
                <TableRow key={inv.id} className="border-white/5">
                  <TableCell className="font-bold">
                    {inv.createdAt?.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-bold">
                    ${Number(inv.amount).toLocaleString()} {inv.currency}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        inv.status === 'paid' ? 'default' : 'destructive'
                      }
                    >
                      {inv.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
