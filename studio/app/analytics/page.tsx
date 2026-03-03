import {
  getFounderIntelligence,
  getEngagementHeatmap,
} from './analytics-actions';
import {
  GlassCard,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@maatwork/ui';
import { BarChart3, TrendingUp, Users, Activity, Layers } from 'lucide-react';

interface HeatmapItem {
  appName: string;
  eventCount: number;
}

export default async function AnalyticsPage() {
  const intel = await getFounderIntelligence();
  const heatmap: HeatmapItem[] = await getEngagementHeatmap();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
            MaatAnalytics™
          </h1>
          <p className="text-muted-foreground mt-2">
            Inteligencia propietaria y métricas de crecimiento en tiempo real.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold border border-green-500/20 uppercase tracking-wider flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Live Engine
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <GlassCard className="p-6">
          <div className="text-primary mb-4 p-2 w-fit rounded-lg bg-primary/10 border border-primary/20">
            <TrendingUp className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
            MRR Proyectado
          </h3>
          <p className="text-3xl font-bold mt-2">
            ${Number(intel.mrr).toLocaleString()}
          </p>
          <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
            +12.5% <span className="text-white/20">vs mes anterior</span>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="text-blue-500 mb-4 p-2 w-fit rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Activity className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
            Eventos Totales
          </h3>
          <p className="text-3xl font-bold mt-2">
            {intel.eventStats.reduce((a, b) => a + b.count, 0)}
          </p>
          <p className="mt-2 text-xs text-white/40 italic">Últimos 30 días</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="text-purple-500 mb-4 p-2 w-fit rounded-lg bg-purple-500/10 border border-purple-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
            Engagement Rate
          </h3>
          <p className="text-3xl font-bold mt-2">84%</p>
          <div className="mt-2 text-xs text-white/40">
            <span className="text-green-400">+2.3%</span> vs mes anterior
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="text-orange-500 mb-4 p-2 w-fit rounded-lg bg-orange-500/10 border border-orange-500/20">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
            Usuarios Activos
          </h3>
          <p className="text-3xl font-bold mt-2">{heatmap.length}</p>
          <p className="mt-2 text-xs text-white/40">Apps monitoreadas</p>
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-black/40 border-white/5 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Growth Trend
            </CardTitle>
            <CardDescription className="text-white/40">
              Daily event volume over last 7 days
            </CardDescription>
          </CardHeader>
          <div className="p-6 flex items-end gap-2 h-48">
            {intel.growthTrend.map((item: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-primary/20 rounded-t hover:bg-primary/40 transition-all"
                  style={{
                    height: `${Math.min((item.count as number) * 10, 100)}%`,
                  }}
                />
                <span className="text-[10px] text-white/30 font-mono">
                  {new Date(item.day).toLocaleDateString('en-US', {
                    weekday: 'short',
                  })}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <GlassCard className="overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              App Engagement Heatmap
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {heatmap.map((item) => (
                <div
                  key={item.appName}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group"
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 group-hover:text-primary/60">
                    {item.appName}
                  </p>
                  <p className="text-2xl font-bold mt-1">{item.eventCount}</p>
                  <p className="text-[10px] text-white/20 mt-1 italic font-mono">
                    interacciones registradas
                  </p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
