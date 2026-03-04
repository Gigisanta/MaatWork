import { db } from "@maatwork/database";
import { clients, apps } from "@maatwork/database/schema";
import { eq } from "drizzle-orm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button, TableSkeleton, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@maatwork/ui";
import { Suspense } from "react";
import { AddClientDialog } from "./client-form";
import { Search, UserPlus, Filter, MoreHorizontal, Download } from "lucide-react";

async function ClientsList({ appId }: { appId: string }) {
  const allClients = await db.select({
    id: clients.id,
    name: clients.name,
    email: clients.email,
    phone: clients.phone,
  }).from(clients).where(eq(clients.appId, appId));

  if (allClients.length === 0) {
    return (
      <Card className="border-dashed border-2 p-12 text-center bg-transparent">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-muted p-4 rounded-full">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">No hay clientes aún</h3>
            <p className="text-muted-foreground max-w-sm">Empieza registrando a tu primer cliente para gestionar sus abonos y asistencia.</p>
          </div>
          <AddClientDialog appId={appId} />
        </div>
      </Card>
    );
  }

  return (
    <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Nombre Completo</TableHead>
            <TableHead>Email / Contacto</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead className="text-right">Gestión</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allClients.map((client) => (
            <TableRow key={client.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="font-mono text-[10px] text-muted-foreground">{client.id.substring(0,8).toUpperCase()}</TableCell>
              <TableCell className="font-semibold">{client.name}</TableCell>
              <TableCell className="text-sm">{client.email || '—'}</TableCell>
              <TableCell className="text-sm font-mono">{client.phone || '—'}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent" aria-label="Más opciones">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import { Users } from "lucide-react";

export default async function ClientsPage({ params }: { params: Promise<{ appSlug: string }> }) {
  const { appSlug } = await params;
  
  const appRecord = await db.query.apps.findFirst({
    where: eq(apps.slug, appSlug),
  });

  if (!appRecord) return <div className="p-8 text-red-500 text-center font-bold">App not found</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase">Gestión de Clientes</h1>
          <p className="text-muted-foreground italic">Administra tu base de miembros, prospectos y perfiles.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
          <AddClientDialog appId={appRecord.id} />
        </div>
      </div>

      <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-lg border">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="search" 
            placeholder="Buscar por nombre, email o ID..." 
            aria-label="Buscar clientes"
            className="w-full bg-transparent pl-9 pr-4 py-2 text-sm focus:outline-none"
          />
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-xs">
          <Filter className="h-3.5 w-3.5" />
          Filtrar
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton rows={8} />}>
        <ClientsList appId={appRecord.id} />
      </Suspense>
    </div>
  );
}
