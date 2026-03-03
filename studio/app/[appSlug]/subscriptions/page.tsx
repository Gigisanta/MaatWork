import { db } from '@maatwork/database';
import { subscriptions, apps, clients } from '@maatwork/database/schema';
import { eq } from 'drizzle-orm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  TableSkeleton,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@maatwork/ui';
import { Suspense } from 'react';
import {
  CreditCard,
  Plus,
  RotateCw,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface SubscriptionData {
  id: string;
  clientName: string;
  plan: string | null;
  status: string;
  createdAt: Date | null;
}

async function SubscriptionsList({ appId }: { appId: string }) {
  const allSubs: SubscriptionData[] = await db
    .select({
      id: subscriptions.id,
      clientName: clients.name,
      plan: subscriptions.plan,
      status: subscriptions.status,
      createdAt: subscriptions.createdAt,
    })
    .from(subscriptions)
    .innerJoin(clients, eq(subscriptions.clientId, clients.id))
    .where(eq(subscriptions.appId, appId));

  if (allSubs.length === 0) {
    return (
      <Card className="border-dashed border-2 p-12 text-center bg-transparent">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-muted p-4 rounded-full">
            <CreditCard className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">Sin abonos activos</h3>
            <p className="text-muted-foreground max-w-sm">
              Los clientes necesitan un abono activo para registrar asistencias
              y pagos.
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Asignar Primer Abono
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Plan / Servicio</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha Inicio</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allSubs.map((sub) => (
            <TableRow
              key={sub.id}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell className="font-semibold">{sub.clientName}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium capitalize">{sub.plan}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    Mensual
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={sub.status === 'active' ? 'success' : 'destructive'}
                  className="gap-1.5"
                >
                  {sub.status === 'active' ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  {sub.status === 'active' ? 'Activo' : 'Inactivo'}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {sub.createdAt?.toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" className="h-8 gap-2">
                  <RotateCw className="h-3.5 w-3.5" />
                  Renovar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default async function SubscriptionsPage({
  params,
}: {
  params: Promise<{ appSlug: string }>;
}) {
  const { appSlug } = await params;

  const appRecord = await db.query.apps.findFirst({
    where: eq(apps.slug, appSlug),
  });

  if (!appRecord) return <div className="p-8 text-red-500">App not found</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase">
            Control de Abonos
          </h1>
          <p className="text-muted-foreground italic">
            Monitorea los planes activos y vencimientos de tus clientes.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Abono
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Próximos Vencimientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground italic">
              En los próximos 7 días
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Cobros Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">$45.200</div>
            <p className="text-xs text-muted-foreground italic">
              Saldo a regularizar
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Tasa de Renovación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">88%</div>
            <p className="text-xs text-muted-foreground italic">
              +2% vs mes anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-lg border">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar por cliente o plan..."
            className="w-full bg-transparent pl-9 pr-4 py-2 text-sm focus:outline-none"
          />
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-xs">
          <Filter className="h-3.5 w-3.5" />
          Filtrar
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton rows={5} />}>
        <SubscriptionsList appId={appRecord.id} />
      </Suspense>
    </div>
  );
}
