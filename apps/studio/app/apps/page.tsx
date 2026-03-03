import { db } from "@maatwork/database";
import { apps, app_invoices, app_subscriptions } from "@maatwork/database/schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge } from "@maatwork/ui";
import { Button } from "@maatwork/ui";
import Link from "next/link";
import { eq, sql } from "drizzle-orm";
import { cache } from "react";

import { AppStatusToggle } from "./components/app-status-toggle";
import { Github, ExternalLink, ShieldCheck, Activity, Database } from "lucide-react";

const getAppsWithStats = cache(async () => {
  return await db
    .select({
      id: apps.id,
      name: apps.name,
      slug: apps.slug,
      template: apps.template,
      githubRepo: apps.githubRepo,
      vercelUrl: apps.vercelUrl,
      neonUrl: apps.neonUrl,
      isInternal: apps.isInternal,
      mrr: sql<number>`COALESCE((
        SELECT sum(${app_invoices.amount})
        FROM ${app_invoices}
        WHERE ${app_invoices.appId} = ${apps.id} 
        AND ${app_invoices.status} = 'paid'
      ), 0)`,
      status: sql<string>`COALESCE((
        SELECT ${app_subscriptions.status}
        FROM ${app_subscriptions}
        WHERE ${app_subscriptions.appId} = ${apps.id}
        ORDER BY ${app_subscriptions.createdAt} DESC
        LIMIT 1
      ), 'inactive')`
    })
    .from(apps);
});

export default async function AppsPage() {
  // Optimized single query to fetch all apps with their MRR and status
  const appsWithStats = await getAppsWithStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Centro de Control
          </h1>
          <p className="text-muted-foreground italic">Monitoreo de salud y despliegue de nuevos centros.</p>
        </div>
        <Link href="/apps/new">
          <Button className="bg-primary/20 hover:bg-primary/30 border-primary/20 text-white backdrop-blur-3xl transition-all">
            Nuevo Centro
          </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Aplicaciones</p>
          <p className="text-2xl font-bold mt-1">{appsWithStats.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Propia MaatWork</p>
          <p className="text-2xl font-bold mt-1">{appsWithStats.filter(t => t.isInternal).length}</p>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/30">GitHub Sync</p>
          <p className="text-2xl font-bold mt-1 text-green-500/80">{appsWithStats.filter(t => t.githubRepo).length}</p>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Vercel Active</p>
          <p className="text-2xl font-bold mt-1 text-blue-500/80">{appsWithStats.filter(t => t.vercelUrl).length}</p>
        </div>
      </div>
      
      <div className="border border-white/5 rounded-xl bg-black/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.02]">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest">Nombre</TableHead>
              <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest">Subdominio</TableHead>
              <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest text-center">App Hub</TableHead>
              <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest">Estado</TableHead>
              <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest">MRR (Total)</TableHead>
              <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest">Plantilla</TableHead>
              <TableHead className="text-right text-white/40 uppercase text-[10px] font-black tracking-widest">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appsWithStats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground italic">
                  No se encontraron centros activos.
                </TableCell>
              </TableRow>
            ) : (
              appsWithStats.map((t) => (
                <TableRow key={t.id} className="border-white/5 hover:bg-white/[0.01] transition-colors group">
                  <TableCell className="font-medium text-white/90">
                    <div className="flex items-center gap-2">
                      {t.name}
                      {t.isInternal && (
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-white/40">{t.slug}.maat.work</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                        {t.githubRepo ? (
                            <a
                                href={`https://github.com/${t.githubRepo}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-white/40 hover:text-white hover:border-white/20 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
                                aria-label={`View GitHub repository for ${t.name}`}
                                title={`View GitHub repository for ${t.name}`}
                            >
                                <Github className="h-3.5 w-3.5" />
                            </a>
                        ) : (
                            <div className="h-6 w-6 rounded-lg border border-dashed border-white/5 opacity-20" />
                        )}
                        {t.vercelUrl ? (
                            <a
                                href={t.slug ? `https://vercel.com/giolivo/${t.slug.startsWith('maat-') ? t.slug : `maat-${t.slug}`}` : t.vercelUrl}
                                title={`View Vercel dashboard for ${t.name}`}
                                aria-label={`View Vercel dashboard for ${t.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-white/40 hover:text-white hover:border-white/20 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                        ) : (
                            <div className="h-6 w-6 rounded-lg border border-dashed border-white/5 opacity-20" />
                        )}
                        {t.neonUrl ? (
                            <a
                                href="https://console.neon.tech/app/projects"
                                title={`View Neon console for ${t.name}`}
                                aria-label={`View Neon console for ${t.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-white/40 hover:text-white hover:border-white/20 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
                            >
                                <Database className="h-3.5 w-3.5" />
                            </a>
                        ) : (
                            <div className="h-6 w-6 rounded-lg border border-dashed border-white/5 opacity-20" />
                        )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={t.status === 'active' ? 'default' : 'destructive'} className="capitalize backdrop-blur-md">
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-primary">
                    ${Number(t.mrr).toLocaleString()}
                  </TableCell>
                  <TableCell className="capitalize text-white/60">{t.template}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                       <AppStatusToggle 
                        appId={t.id} 
                        currentStatus={t.status as any} 
                      />
                      <Button variant="ghost" size="sm" asChild className="hover:bg-white/5">
                        <Link href={`/apps/${t.id}`}>Gestionar</Link>
                      </Button>
                    </div>
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
