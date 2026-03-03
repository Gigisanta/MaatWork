import { db } from "@maatwork/database";
import { analytics_events } from "@maatwork/database/schema";
import { eq, desc } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge
} from "@maatwork/ui";
import { Activity, BarChart3 } from "lucide-react";

export async function AppAnalyticsDetail({ appId }: { appId: string }) {
  const events = await db.select().from(analytics_events).where(eq(analytics_events.appId, appId)).orderBy(desc(analytics_events.createdAt)).limit(20);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
         <Card className="border-white/5 bg-white/[0.02]">
            <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase font-black tracking-widest text-white/40 flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Eventos Totales
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{events.length}</div>
                <p className="text-[10px] text-muted-foreground mt-1">Últimas 20 interacciones</p>
            </CardContent>
         </Card>
      </div>

      <Card className="border-white/5 bg-white/[0.02] overflow-hidden">
        <CardHeader className="bg-white/[0.01] border-b border-white/5">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Stream de Eventos en Vivo
          </CardTitle>
        </CardHeader>
        <div className="p-4 space-y-3">
          {events.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground italic text-sm border-2 border-dashed border-white/5 rounded-xl">
              No hay eventos registrados recientemente para esta aplicación.
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 group hover:border-primary/20 transition-all">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white/90 uppercase tracking-tighter">{event.eventType}</span>
                  <span className="text-[10px] text-white/30 font-mono italic">{new Date(event.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    {event.value && (
                        <Badge variant="outline" className="text-[10px] font-mono border-white/10">
                            val: {event.value}
                        </Badge>
                    )}
                    <Badge variant="secondary" className="text-[9px] uppercase font-black bg-primary/10 text-primary border-primary/20">
                        {event.source}
                    </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
