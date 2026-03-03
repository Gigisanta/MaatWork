import { db } from '@maatwork/database';
import { clients, apps } from '@maatwork/database/schema';
import { eq } from 'drizzle-orm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  GlassCard,
  Badge,
} from '@maatwork/ui';
import { Users, Building2, Calendar } from 'lucide-react';

interface ClientData {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  createdAt: Date | null;
  appName: string;
  appSlug: string;
}

export default async function GlobalClientsPage() {
  const allClients: ClientData[] = await db
    .select({
      id: clients.id,
      name: clients.name,
      email: clients.email,
      phone: clients.phone,
      createdAt: clients.createdAt,
      appName: apps.name,
      appSlug: apps.slug,
    })
    .from(clients)
    .innerJoin(apps, eq(clients.appId, apps.id))
    .orderBy(clients.createdAt);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Gestión Global de Clientes
        </h1>
        <p className="text-muted-foreground italic text-sm">
          Vista consolidada de todos los usuarios de la red MaatWork.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
                Total Clientes
              </p>
              <p className="text-2xl font-bold">{allClients.length}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="overflow-hidden">
        <Table>
          <TableHeader className="bg-white/[0.02]">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest px-6">
                Cliente
              </TableHead>
              <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest">
                Contacto
              </TableHead>
              <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest">
                Aplicación Origen
              </TableHead>
              <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest">
                Fecha Registro
              </TableHead>
              <TableHead className="text-right text-white/40 uppercase text-[10px] font-black tracking-widest px-6">
                ID
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allClients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground italic"
                >
                  No hay clientes registrados en ninguna aplicación.
                </TableCell>
              </TableRow>
            ) : (
              allClients.map((client) => (
                <TableRow
                  key={client.id}
                  className="border-white/5 hover:bg-white/[0.01] transition-colors group"
                >
                  <TableCell className="px-6 py-4 font-medium text-white/90">
                    {client.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{client.email || 'N/A'}</span>
                      <span className="text-xs text-white/40">
                        {client.phone || ''}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3 w-3 text-primary/60" />
                      <span className="text-sm font-semibold">
                        {client.appName}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-mono border-white/10 opacity-60"
                      >
                        {client.appSlug}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {client.createdAt?.toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right font-mono text-[10px] text-white/20">
                    {client.id}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </GlassCard>
    </div>
  );
}
