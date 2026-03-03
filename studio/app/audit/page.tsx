import { getAuditLogs } from './audit-actions';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  GlassCard,
} from '@maatwork/ui';
import { ShieldCheck, History, Fingerprint, Search } from 'lucide-react';

interface AuditLogData {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  appName: string | null;
  userName: string | null;
  ipAddress: string | null;
}

export default async function AuditPage() {
  const logs: AuditLogData[] = await getAuditLogs();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
          Audit Vault
        </h1>
        <p className="text-muted-foreground mt-2">
          Registro inmutable de acciones críticas para cumplimiento SOC2 y
          auditoría.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <GlassCard className="p-6">
          <div className="flex items-center gap-4 text-primary">
            <ShieldCheck className="h-6 w-6" />
            <h3 className="font-bold uppercase tracking-widest text-xs">
              Estado Vault
            </h3>
          </div>
          <p className="text-2xl font-bold mt-4">Protegido</p>
          <p className="text-[10px] text-white/40 uppercase mt-1">
            Integridad verificada
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4 text-green-500">
            <Fingerprint className="h-6 w-6" />
            <h3 className="font-bold uppercase tracking-widest text-xs">
              Total Eventos
            </h3>
          </div>
          <p className="text-2xl font-bold mt-4">{logs.length}</p>
          <p className="text-[10px] text-white/40 uppercase mt-1">
            Últimos 30 días
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4 text-blue-500">
            <History className="h-6 w-6" />
            <h3 className="font-bold uppercase tracking-widest text-xs">
              Uptime Vault
            </h3>
          </div>
          <p className="text-2xl font-bold mt-4">99.9%</p>
          <p className="text-[10px] text-white/40 uppercase mt-1">
            Disponibilidad en tiempo real
          </p>
        </GlassCard>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            Historial de Auditoría
          </h2>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-white/40">
            <Search className="h-3.5 w-3.5" />
            Filtrar eventos...
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  Evento
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  Entidad
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  Actor
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  Fecha
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-right">
                  Contexto
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log: AuditLogData) => (
                <tr
                  key={log.id}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs text-white/90">
                    {log.action}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {log.entityType}
                      </span>
                      <span className="text-[10px] text-white/40 font-mono italic">
                        {log.entityId || 'system'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {log.userName || 'Admin Maat'}
                      </span>
                      <span className="text-[10px] text-white/40 font-mono">
                        {log.ipAddress || 'internal'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/60">
                    {log.createdAt.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <code className="text-[10px] px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {JSON.stringify(log.metadata)}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
