import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
} from '@maatwork/ui';
import { db } from '@maatwork/database';
import { apps } from '@maatwork/database/schema';
import { eq } from 'drizzle-orm';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  MapPin,
  MoreVertical,
  Filter,
} from 'lucide-react';

export default async function AgendaPage({
  params,
}: {
  params: Promise<{ appSlug: string }>;
}) {
  const resolvedParams = await params;

  const appRecord = await db.query.apps.findFirst({
    where: eq(apps.slug, resolvedParams.appSlug),
  });

  if (!appRecord)
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        App not found
      </div>
    );

  const today = new Date();
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase">
            Agenda de Turnos
          </h1>
          <p className="text-muted-foreground italic">
            Visualiza y gestiona las clases y citas de la semana.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg overflow-hidden bg-card">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-none border-r"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-4 py-2 text-sm font-medium border-r bg-muted/20">
              Hoy,{' '}
              {today.toLocaleDateString('es-AR', {
                day: 'numeric',
                month: 'short',
              })}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-none"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Turno
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between bg-muted/30 p-2 rounded-lg border">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 text-xs font-semibold"
          >
            Semana
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            Día
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            Mes
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-xs">
          <Filter className="h-3.5 w-3.5" />
          Filtrar por Sala/Profesor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day, i) => {
          const isToday = i === 0;
          return (
            <Card
              key={i}
              className={
                isToday
                  ? 'border-primary/50 ring-1 ring-primary/20 shadow-md ring-offset-2'
                  : 'shadow-sm'
              }
            >
              <CardHeader
                className={`p-4 pb-2 border-b text-center ${isToday ? 'bg-primary/5' : 'bg-muted/10'}`}
              >
                <CardTitle
                  className={`text-xs font-bold uppercase tracking-widest ${isToday ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {day.toLocaleDateString('es-AR', { weekday: 'short' })}
                </CardTitle>
                <div
                  className={`text-xl font-black ${isToday ? 'text-primary' : ''}`}
                >
                  {day.getDate()}
                </div>
              </CardHeader>
              <CardContent className="p-2 space-y-3 pt-4 min-h-[350px]">
                {/* Mock dynamic entries */}
                {i === 0 && (
                  <>
                    <AgendaItem
                      time="09:00"
                      title="CrossFit Principiantes"
                      sub="Coach: Julián"
                      variant="primary"
                    />
                    <AgendaItem
                      time="11:30"
                      title="Yoga Flow"
                      sub="Coach: Mara"
                      variant="secondary"
                    />
                  </>
                )}
                {i === 1 && (
                  <AgendaItem
                    time="18:00"
                    title="Entrenamiento Funcional"
                    sub="Coach: Tomi"
                    variant="primary"
                  />
                )}
                {i === 2 && (
                  <AgendaItem
                    time="10:00"
                    title="Natación"
                    sub="Coach: Gio"
                    variant="accent"
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function AgendaItem({
  time,
  title,
  sub,
  variant,
}: {
  time: string;
  title: string;
  sub: string;
  variant?: 'primary' | 'secondary' | 'accent';
}) {
  const variantStyles = {
    primary: 'bg-primary/10 border-primary/20 text-primary-foreground',
    secondary:
      'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300',
    accent:
      'bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-300',
  };

  return (
    <div
      className={`group relative flex flex-col p-2.5 rounded-lg border text-[11px] leading-tight transition-all hover:shadow-sm cursor-pointer ${variantStyles[variant || 'primary']}`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1 font-bold opacity-80">
          <Clock className="h-3 w-3" />
          {time}
        </div>
        <MoreVertical className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="font-bold truncate text-[12px] mb-0.5">{title}</div>
      <div className="opacity-70 truncate italic flex items-center gap-1">
        <User className="h-2.5 w-2.5" />
        {sub}
      </div>
    </div>
  );
}
