import { getGlobalBillingData } from './billing-actions';
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
  Button,
} from '@maatwork/ui';
import { CreditCard, TrendingUp, AlertCircle, FileText } from 'lucide-react';
import { CreateInvoiceDialog } from './components/create-invoice-dialog';

interface InvoiceData {
  id: string;
  amount: string;
  status: string;
  createdAt: Date;
  appName: string;
}

interface AppData {
  id: string;
  name: string;
  mrr: number;
}

interface StatsData {
  totalMRR: number;
  paidCount: number;
  pendingCount: number;
}

export default async function BillingPage() {
  const {
    stats,
    recentInvoices,
    apps,
  }: { stats: StatsData; recentInvoices: InvoiceData[]; apps: AppData[] } =
    await getGlobalBillingData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Gestión de Facturación
        </h1>
        <p className="text-muted-foreground italic text-sm">
          Control financiero global y conciliación de pagos.
        </p>
      </div>
      <CreateInvoiceDialog apps={apps} />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-white/5 bg-black/40 backdrop-blur-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-white/70">
              MRR Total
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${Number(stats.totalMRR).toLocaleString()}
            </div>
            <p className="text-[10px] text-muted-foreground uppercase mt-1">
              Ingreso recurrente proyectado
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/5 bg-black/40 backdrop-blur-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-white/70">
              Facturas Cobradas
            </CardTitle>
            <CreditCard className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.paidCount}
            </div>
            <p className="text-[10px] text-muted-foreground uppercase mt-1">
              Pagos conciliados este mes
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/5 bg-black/40 backdrop-blur-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-white/70">
              Pendientes de Pago
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.pendingCount}
            </div>
            <p className="text-[10px] text-muted-foreground uppercase mt-1">
              Acción requerida
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-white/5 bg-black/40 backdrop-blur-3xl overflow-hidden">
          <CardHeader className="bg-white/[0.01] border-b border-white/5">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Últimas Facturas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-white/40">
                    Centro
                  </TableHead>
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-white/40">
                    Monto
                  </TableHead>
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-white/40">
                    Estado
                  </TableHead>
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-white/40">
                    Fecha
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInvoices.map((inv: InvoiceData) => (
                  <TableRow
                    key={inv.id}
                    className="border-white/5 hover:bg-white/[0.01]"
                  >
                    <TableCell className="font-medium text-white/80">
                      {inv.appName}
                    </TableCell>
                    <TableCell className="text-white/90">
                      ${Number(inv.amount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          inv.status === 'paid' ? 'default' : 'destructive'
                        }
                        className="text-[10px] capitalize"
                      >
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-white/40">
                      {inv.createdAt?.toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-white/5 bg-black/40 backdrop-blur-3xl">
          <CardHeader className="bg-white/[0.01] border-b border-white/5">
            <CardTitle className="text-lg font-bold">
              Distribución por Centro
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {apps.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all"
                >
                  <div className="text-sm font-medium text-white/80">
                    {t.name}
                  </div>
                  <div className="font-mono text-sm text-primary">
                    ${Number(t.mrr).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
