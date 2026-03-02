import { getSystemHealth } from "./actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button
} from "@maatwork/ui";
import {
  CheckCircle2,
  AlertCircle,
  Activity,
  RefreshCcw,
  Github,
  Database,
  ExternalLink
} from "lucide-react";

export default async function HealthPage() {
  const healthItems = await getSystemHealth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Salud del Ecosistema
          </h1>
          <p className="text-muted-foreground italic text-sm">Estado en tiempo real de los servicios core de Maatwork.</p>
        </div>
        <form action={async () => { 'use server'; }}>
            <Button variant="outline" className="border-white/10 hover:bg-white/5">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Actualizar
            </Button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {healthItems.map((item) => (
          <Card key={item.service} className="border-white/5 bg-black/40 backdrop-blur-3xl overflow-hidden group hover:border-white/10 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium uppercase tracking-widest text-white/40">
                {item.service}
              </CardTitle>
              {item.service === 'github' && <Github className="h-4 w-4 text-white/20" />}
              {item.service === 'vercel' && <ExternalLink className="h-4 w-4 text-white/20" />}
              {item.service === 'neon' && <Database className="h-4 w-4 text-white/20" />}
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {item.status === 'operational' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
                <span className="text-lg font-bold text-white/90 capitalize">
                  {item.status === 'operational' ? 'Operativo' : 'Falla'}
                </span>
              </div>
              <p className="text-xs text-white/40 mt-2 italic">{item.message}</p>

              <div className="mt-4 pt-4 border-t border-white/5">
                <Badge variant="outline" className={`text-[9px] uppercase font-black tracking-widest ${item.status === 'operational' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-destructive border-destructive/20 bg-destructive/5'}`}>
                   {item.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/5 bg-black/40 backdrop-blur-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Salud de Proyectos (Apps)
          </CardTitle>
          <CardDescription>Resumen consolidado de la salud de todos los despliegues de clientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 border-2 border-dashed border-white/5 rounded-xl opacity-20">
             <p className="text-xs italic">Cargando métricas detalladas de proyectos...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
