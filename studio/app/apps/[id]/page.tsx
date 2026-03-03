import { notFound } from 'next/navigation';
import { db } from '@maatwork/database';
import { apps, users, clients } from '@maatwork/database/schema';
import { eq } from 'drizzle-orm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Skeleton,
} from '@maatwork/ui';
import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  Building,
  Activity,
  ShieldCheck,
  Receipt,
  BarChart3,
  Database,
} from 'lucide-react';
import { ProjectHub } from '../components/project-hub';
import { AppBillingDetail } from '../components/detail/app-billing-detail';
import { AppAnalyticsDetail } from '../components/detail/app-analytics-detail';
import { Suspense } from 'react';

interface UserData {
  id: string;
  email: string;
  role: string;
}

interface ClientData {
  id: string;
  name: string;
}

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const appId = resolvedParams.id;

  const appRecords = await db.select().from(apps).where(eq(apps.id, appId));
  const app = appRecords[0];

  if (!app) {
    notFound();
  }

  const appUsers: UserData[] = await db
    .select()
    .from(users)
    .where(eq(users.appId, appId));
  const appClients: ClientData[] = await db
    .select()
    .from(clients)
    .where(eq(clients.appId, appId));

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/apps">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{app.name}</h1>
          <p className="text-muted-foreground">
            {app.slug}.maat.work • Template:{' '}
            <span className="capitalize">{app.template}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Platform Users
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              Admins and employees
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appClients.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered in platform
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Active</div>
            <p className="text-xs text-muted-foreground">
              Since {app.createdAt?.toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="infrastructure" className="space-y-6">
        <TabsList className="bg-black/20 border border-white/5 p-1">
          <TabsTrigger value="infrastructure" className="gap-2">
            <Database className="w-4 h-4" /> Infraestructura
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" /> Usuarios & Clientes
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <Receipt className="w-4 h-4" /> Facturación
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="w-4 h-4" /> Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="infrastructure" className="space-y-6 outline-none">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <ProjectHub
                appId={app.id}
                githubRepo={app.githubRepo}
                vercelProjectId={app.vercelProjectId}
                vercelUrl={app.vercelUrl}
                neonUrl={app.neonUrl}
                isInternal={app.isInternal}
              />
            </div>
            <Card className="border-white/5 bg-black/40 backdrop-blur-3xl">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Configuración Core
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">
                    Internal ID
                  </p>
                  <p className="text-xs text-white/60 font-mono break-all bg-white/5 p-2 rounded border border-white/5">
                    {app.id}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">
                    Custom Domain
                  </p>
                  <p className="text-sm text-white/80 font-semibold">
                    {app.domain || 'Ninguno configurado'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">
                    Estado Aprovisionamiento
                  </p>
                  <p className="text-sm text-primary font-bold uppercase italic">
                    {app.provisioningStatus || 'desconocido'}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-white/5 hover:bg-white/5 text-[10px] uppercase font-black"
                  >
                    Refrescar Salud
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full text-[10px] uppercase font-black"
                  >
                    Suspender Aplicación
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6 outline-none">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-white/5 bg-black/40 backdrop-blur-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" /> Admins &
                  Empleados
                </CardTitle>
                <CardDescription>
                  Personas con acceso al panel administrativo de esta app.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-[10px] uppercase font-black text-white/40">
                        Email
                      </TableHead>
                      <TableHead className="text-[10px] uppercase font-black text-white/40">
                        Rol
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appUsers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          className="text-center text-muted-foreground py-8 italic text-sm"
                        >
                          No se encontraron usuarios internos.
                        </TableCell>
                      </TableRow>
                    ) : (
                      appUsers.map((user) => (
                        <TableRow key={user.id} className="border-white/5">
                          <TableCell className="font-medium text-white/80">
                            {user.email}
                          </TableCell>
                          <TableCell className="capitalize text-white/40 font-mono text-xs">
                            {user.role}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-white/5 bg-black/40 backdrop-blur-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" /> Clientes
                  Registrados
                </CardTitle>
                <CardDescription>
                  Usuarios finales gestionados por este centro.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/5 rounded-2xl opacity-40">
                  <p className="text-2xl font-bold">{appClients.length}</p>
                  <p className="text-[10px] uppercase tracking-widest mt-1">
                    Clientes Totales
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="mt-4 text-primary"
                    asChild
                  >
                    <Link href="/clients">Ver en Gestión Global</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="outline-none">
          <Suspense
            fallback={
              <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
                <Skeleton className="h-32 w-full max-w-md" />
              </div>
            }
          >
            <AppBillingDetail appId={app.id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="analytics" className="outline-none">
          <Suspense
            fallback={
              <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
                <Skeleton className="h-32 w-full max-w-md" />
              </div>
            }
          >
            <AppAnalyticsDetail appId={app.id} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
