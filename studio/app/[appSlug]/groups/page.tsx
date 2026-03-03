import { db } from '@maatwork/database';
import { groups, apps } from '@maatwork/database/schema';
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
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
} from '@maatwork/ui';
import { Suspense } from 'react';
import {
  Users,
  Plus,
  Calendar,
  Clock,
  User,
  Users2,
  ChevronRight,
  Filter,
  Search,
} from 'lucide-react';

interface GroupData {
  id: string;
  name: string;
  schedule: string | null;
}

async function GroupsList({ appId }: { appId: string }) {
  const allGroups: GroupData[] = await db
    .select({
      id: groups.id,
      name: groups.name,
      schedule: groups.schedule,
    })
    .from(groups)
    .where(eq(groups.appId, appId));

  if (allGroups.length === 0) {
    return (
      <Card className="border-dashed border-2 p-12 text-center bg-transparent">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-muted p-4 rounded-full">
            <Users2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">No hay grupos creados</h3>
            <p className="text-muted-foreground max-w-sm">
              Crea grupos para organizar tus clases, turnos o sesiones de
              entrenamiento.
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Crear Primer Grupo
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
            <TableHead>Nombre del Grupo</TableHead>
            <TableHead>Profesor / Coach</TableHead>
            <TableHead>Horarios</TableHead>
            <TableHead>Ocupación</TableHead>
            <TableHead className="text-right">Gestión</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allGroups.map((g) => (
            <TableRow
              key={g.id}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell className="font-semibold">{g.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>A designar</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] gap-1.5 uppercase"
                >
                  <Clock className="h-3 w-3" />
                  {typeof g.schedule === 'string' ? g.schedule : 'Sin horario'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[45%]" />
                  </div>
                  <span className="text-xs text-muted-foreground">9/20</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" className="h-8 gap-2">
                  Detalles
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default async function GroupsPage({
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
            Grupos y Clases
          </h1>
          <p className="text-muted-foreground italic">
            Organiza tus sesiones, cupos y horarios de entrenamiento.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Clase
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              Clases Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8 Sesiones</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
              <Users className="h-3.5 w-3.5" />
              Promedio Ocupación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">64%</div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-primary uppercase flex items-center gap-2">
              <Plus className="h-3.5 w-3.5" />
              Grupos Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">CrossFit, Funcional</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-lg border">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar por nombre de grupo..."
            className="w-full bg-transparent pl-9 pr-4 py-2 text-sm focus:outline-none"
          />
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-xs">
          <Filter className="h-3.5 w-3.5" />
          Filtrar
        </Button>
      </div>

      <Suspense fallback={<TableSkeleton rows={6} />}>
        <GroupsList appId={appRecord.id} />
      </Suspense>
    </div>
  );
}
