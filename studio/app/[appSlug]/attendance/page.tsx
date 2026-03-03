'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Badge,
} from '@maatwork/ui';
import { useToast } from '@maatwork/ui';
import {
  Scan,
  UserCheck,
  Clock,
  Search,
  AlertCircle,
  CheckCircle2,
  Users,
} from 'lucide-react';

export default function AttendancePage({
  params,
}: {
  params: Promise<{ appSlug: string }>;
}) {
  const [clientId, setClientId] = useState('');
  const { toast } = useToast();
  const [recentAttendance, setRecentAttendance] = useState([
    { id: '1', name: 'Carlos Gómez', time: '18:02hs', status: 'success' },
    { id: '2', name: 'Marta Rodríguez', time: '17:45hs', status: 'success' },
    {
      id: '3',
      name: 'Juan Pérez',
      time: '17:30hs',
      status: 'warning',
      note: 'Cuota vence mañana',
    },
  ]);

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;

    // Simulate API validation
    const success = true;

    if (success) {
      toast({
        title: 'Asistencia Registrada',
        description: `Cliente #${clientId} ingresó correctamente.`,
      });
      // Add to local list for feedback
      setRecentAttendance([
        {
          id: Math.random().toString(),
          name: `Cliente ${clientId}`,
          time:
            new Date().toLocaleTimeString('es-AR', {
              hour: '2-digit',
              minute: '2-digit',
            }) + 'hs',
          status: 'success',
        },
        ...recentAttendance,
      ]);
    } else {
      toast({
        title: 'Error de Ingreso',
        description: 'El cliente no tiene un abono activo.',
        variant: 'destructive',
      });
    }
    setClientId('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight uppercase">
          Control de Asistencia
        </h1>
        <p className="text-muted-foreground italic">
          Registra el ingreso de tus clientes de forma rápida y sencilla.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5 text-primary" />
              Ingreso Rápido
            </CardTitle>
            <CardDescription aria-autocomplete="none">
              Escanea el código QR o ingresa el ID del cliente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCheckIn} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="ID del Cliente (ej. 1024)"
                  className="pl-10 text-xl py-6 font-mono tracking-widest placeholder:tracking-normal placeholder:font-sans"
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full py-6 text-lg font-bold uppercase gap-2"
              >
                <UserCheck className="h-5 w-5" />
                Registrar Ingreso
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Últimos Ingresos
            </CardTitle>
            <CardDescription>
              Resumen de actividad reciente hoy.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentAttendance.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex gap-3 items-center">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm leading-tight">
                        {entry.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                        {entry.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge
                      variant={
                        entry.status === 'success' ? 'success' : 'warning'
                      }
                      className="text-[9px] uppercase h-5 px-1.5"
                    >
                      {entry.status === 'success' ? 'OK' : 'ALERTA'}
                    </Badge>
                    {entry.note && (
                      <span className="text-[10px] text-orange-600 font-medium italic">
                        {entry.note}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {recentAttendance.length > 0 && (
              <Button
                variant="ghost"
                className="w-full text-xs text-muted-foreground rounded-t-none h-10"
              >
                Ver historial completo
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/20 border-dashed border p-6 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <AlertCircle className="h-6 w-6 text-muted-foreground" />
          <div className="text-sm">
            <p className="font-semibold">Modo de Operación Offline</p>
            <p className="text-muted-foreground">
              Las asistencias se sincronizarán cuando se restablezca la
              conexión.
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="gap-1.5 border-green-500/50 text-green-600 bg-green-50/50"
        >
          <CheckCircle2 className="h-3 w-3" />
          Conectado
        </Badge>
      </div>
    </div>
  );
}
