import { db } from '@maatwork/database';
import { eq, count, desc } from 'drizzle-orm';
import {
  activity_logs,
  apps,
  clients,
  subscriptions,
  attendances,
} from '@maatwork/database/schema';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardSkeleton,
  RecentActivity,
  ActivityItem,
} from '@maatwork/ui';
import { Suspense } from 'react';
import {
  Users,
  CreditCard,
  TrendingUp,
  ArrowLeft,
  Settings,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import Link from 'next/link';

interface ActivityLogData {
  id: string;
  action: string;
  details: Record<string, unknown> | null;
  createdAt: Date | null;
}

async function AppKPIs({ appId }: { appId: string }) {
  const [[totalClientsRes], [activeSubsRes], [todayAttendancesRes]] =
    await Promise.all([
      db
        .select({ count: count() })
        .from(clients)
        .where(eq(clients.appId, appId)),
      db
        .select({ count: count() })
        .from(subscriptions)
        .where(eq(subscriptions.appId, appId)),
      db
        .select({ count: count() })
        .from(attendances)
        .where(eq(attendances.appId, appId)),
    ]);

  const totalClients = totalClientsRes?.count || 0;
  const activeSubs = activeSubsRes?.count || 0;
  const todayAttendances = todayAttendancesRes?.count || 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-white/50">
            Métricas Clientes
          </CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalClients}</div>
          <p className="text-[10px] text-white/30 uppercase mt-1">
            Total de registros
          </p>
        </CardContent>
      </Card>
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-white/50">
            Suscripciones
          </CardTitle>
          <CreditCard className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{activeSubs}</div>
          <p className="text-[10px] text-white/30 uppercase mt-1">
            Planes activos
          </p>
        </CardContent>
      </Card>
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-white/50">
            Tracción Hoy
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{todayAttendances}</div>
          <p className="text-[10px] text-white/30 uppercase mt-1">
            Asistencias registradas
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function AppManagementPage({
  params,
}: {
  params: Promise<{ appSlug: string }>;
}) {
  const { appSlug } = await params;

  const appRecord = await db.query.apps.findFirst({
    where: eq(apps.slug, appSlug),
  });

  if (!appRecord) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-2xl font-bold text-white/80">App No Encontrado</h1>
        <p className="text-white/40 text-sm italic">
          Slug buscado: "{appSlug}"
        </p>
        <Link
          href="/"
          className="text-primary hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al HQ
        </Link>
      </div>
    );
  }

  const logs: ActivityLogData[] = await db
    .select()
    .from(activity_logs)
    .where(eq(activity_logs.appId, appRecord.id))
    .orderBy(desc(activity_logs.createdAt))
    .limit(5);

  const activityItems: ActivityItem[] = logs.map((log) => ({
    id: log.id,
    title: log.action.replace(/_/g, ' '),
    description: JSON.stringify(log.details),
    timestamp: log.createdAt?.toLocaleString() || 'Reciente',
    icon: log.action.includes('APP') ? (
      <Building2 className="h-4 w-4" />
    ) : log.action.includes('SECURITY') ? (
      <ShieldCheck className="h-4 w-4" />
    ) : log.action.includes('PAYMENT') ? (
      <TrendingUp className="h-4 w-4" />
    ) : (
      <Users className="h-4 w-4" />
    ),
    variant: log.action.includes('FAILED')
      ? 'destructive'
      : log.action.includes('CREATED')
        ? 'success'
        : 'default',
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/"
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-white/60" />
            </Link>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              Vista de Gestión
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">
            {appRecord.name}
          </h1>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1.5 text-green-400/80">
              <ShieldCheck className="h-3.5 w-3.5" />
              Suscripción Pro
            </span>
            <span className="uppercase tracking-widest border-l border-white/10 pl-4">
              {appRecord.template}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all text-white/80">
            <Settings className="h-4 w-4" />
            Configurar App
          </button>
          <a
            href={`http://${appSlug}.localhost:3000`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            Abrir App Cliente
          </a>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        }
      >
        <AppKPIs appId={appRecord.id} />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-black/40 border-white/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider">
              Actividad Específica del Centro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity items={activityItems} />
          </CardContent>
        </Card>

        <Card className="bg-white/[0.02] border-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-white/70">
              Resumen del Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="text-xs font-bold text-green-400 uppercase mb-1">
                  Salud del App
                </div>
                <div className="text-lg font-bold text-white">
                  Excelente (98%)
                </div>
              </div>
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="text-xs font-bold text-blue-400 uppercase mb-1">
                  Próxima Factura
                </div>
                <div className="text-lg font-bold text-white">01 Abr, 2026</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
