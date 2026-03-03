import { db } from '@maatwork/database';
import { apps, users, app_invoices } from '@maatwork/database/schema';
import { count, sql } from 'drizzle-orm';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardSkeleton,
  RecentActivity,
  ActivityItem,
  CardDescription,
} from '@maatwork/ui';
import { Suspense } from 'react';
import {
  Building2,
  Users,
  Zap,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  Clock,
  Github,
  ExternalLink,
  TrendingUp,
} from 'lucide-react';
import { getTodos } from './todo-actions';
import { TodoList } from './components/todo-list';
import { activity_logs } from '@maatwork/database/schema';
import { desc } from 'drizzle-orm';
import { cache } from 'react';

async function StudioKPIs() {
  const [counts, invoicesList]: [
    [
      { count: number }[],
      { count: number }[],
      { count: number }[],
      { count: number }[],
    ],
    { amount: string; status: string }[],
  ] = await Promise.all([
    Promise.all([
      db.select({ count: count() }).from(apps),
      db.select({ count: count() }).from(users),
      db
        .select({ count: count() })
        .from(apps)
        .where(sql`${apps.githubRepo} IS NOT NULL`),
      db
        .select({ count: count() })
        .from(apps)
        .where(sql`${apps.vercelUrl} IS NOT NULL`),
    ]),
    db
      .select({ amount: app_invoices.amount, status: app_invoices.status })
      .from(app_invoices),
  ]);

  const [appsCount, usersCount, githubCount, vercelCount] = counts.map(
    (r) => r[0],
  );

  const mrr = invoicesList
    .filter((inv: { amount: string; status: string }) => inv.status === 'paid')
    .reduce(
      (sum: number, inv: { amount: string; status: string }) =>
        sum + Number(inv.amount),
      0,
    );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-white/5 bg-black/40 backdrop-blur-3xl group hover:border-primary/20 transition-all duration-500">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-white/70">
            Ingresos Est. (MRR)
          </CardTitle>
          <Zap className="h-4 w-4 text-primary animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            ${mrr.toLocaleString('es-AR')}
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
            {invoicesList.filter((inv) => inv.status === 'paid').length}{' '}
            facturas activas
          </p>
        </CardContent>
      </Card>
      <Card className="border-white/5 bg-black/40 backdrop-blur-3xl group hover:border-blue-500/20 transition-all duration-500">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-white/70">
            Centros Activos
          </CardTitle>
          <Building2 className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white/90">
            {appsCount?.count || 0}
          </div>
          <p className="text-[10px] text-blue-400/60 uppercase tracking-widest mt-1">
            +2 este mes
          </p>
        </CardContent>
      </Card>
      <Card className="border-white/5 bg-black/40 backdrop-blur-3xl group hover:border-green-500/20 transition-all duration-500">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-white/70">
            GitHub Sync
          </CardTitle>
          <Github className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white/90">
            {githubCount?.count || 0}
          </div>
          <p className="text-[10px] text-green-400/60 uppercase tracking-widest mt-1">
            Sincronizados
          </p>
        </CardContent>
      </Card>
      <Card className="border-white/5 bg-black/40 backdrop-blur-3xl group hover:border-purple-500/20 transition-all duration-500">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-white/70">
            Vercel Active
          </CardTitle>
          <ExternalLink className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white/90">
            {vercelCount?.count || 0}
          </div>
          <p className="text-[10px] text-purple-400/60 uppercase tracking-widest mt-1">
            Despliegues
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function StudioKPIsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

interface LogData {
  id: string;
  action: string;
  details: unknown;
  createdAt: Date;
}

const getRecentLogs = cache(async (): Promise<LogData[]> => {
  return await db
    .select()
    .from(activity_logs)
    .orderBy(desc(activity_logs.createdAt))
    .limit(10);
});

export default async function StudioHomePage() {
  const [todos, logs] = await Promise.all([getTodos(), getRecentLogs()]);

  const activityItems: ActivityItem[] = logs.map((log: LogData) => ({
    id: log.id,
    title: log.action.replace(/_/g, ' '),
    description:
      log.details && typeof log.details === 'object'
        ? Object.entries(log.details as Record<string, unknown>)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ')
        : '',
    timestamp: log.createdAt?.toLocaleString() || 'Reciente',
    icon: log.action.includes('APP') ? (
      <Building2 className="w-4 h-4" />
    ) : log.action.includes('SECURITY') ? (
      <CheckCircle2 className="w-4 h-4" />
    ) : log.action.includes('PAYMENT') || log.action.includes('INVOICE') ? (
      <TrendingUp className="w-4 h-4" />
    ) : (
      <UserPlus className="w-4 h-4" />
    ),
    variant: log.action.includes('FAILED')
      ? 'destructive'
      : log.action.includes('CREATED')
        ? 'success'
        : 'default',
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Studio Dashboard
        </h1>
        <p className="text-muted-foreground italic">
          Vista global del ecosistema Maatwork.
        </p>
      </div>

      <Suspense fallback={<StudioKPIsLoading />}>
        <StudioKPIs />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <TodoList initialTodos={todos} />
        <Card className="col-span-3 border-white/5 bg-black/40 backdrop-blur-3xl overflow-hidden group">
          <CardHeader className="border-b border-white/5 bg-white/[0.01]">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Estado del Sistema
            </CardTitle>
            <CardDescription className="text-white/40">
              Monitoreo en tiempo real de servicios core.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <div className="text-sm font-medium text-green-500/80">
                  Todos los servicios operativos
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="space-y-1">
                  <div className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em]">
                    API Latency
                  </div>
                  <div className="text-lg font-mono text-white/90">24ms</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em]">
                    DB Load
                  </div>
                  <div className="text-lg font-mono text-white/90">12%</div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <div className="text-[10px] text-white/30 mb-2 italic uppercase font-black tracking-widest">
                  Próximo despliegue programado:
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Clock className="h-3 w-3" />
                  <span>Mañana, 04:00 AM (v1.1.0)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <RecentActivity
          items={activityItems}
          className="bg-black/40 backdrop-blur-3xl border-white/5"
        />
      </div>
    </div>
  );
}
