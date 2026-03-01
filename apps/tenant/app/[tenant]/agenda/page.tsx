import { Card, CardContent, CardHeader, CardTitle, Button } from "@maatwork/ui";
import { db } from "@maatwork/database";
import { tenants } from "@maatwork/database/schema";
import { eq } from "drizzle-orm";

export default async function AgendaPage({ params }: { params: Promise<{ tenant: string }> }) {
  const resolvedParams = await params;
  
  const tenantRecord = await db.query.tenants.findFirst({
    where: eq(tenants.slug, resolvedParams.tenant),
  });

  if (!tenantRecord) return <div>Tenant not found</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Agenda / Turns</h1>
        <Button>New Appointment</Button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {/* Placeholder for calendar UI */}
        {Array.from({ length: 7 }).map((_, i) => (
          <Card key={i} className="min-h-[400px]">
            <CardHeader className="p-4 pb-2 border-b bg-muted/30">
              <CardTitle className="text-sm font-medium text-center">
                {new Date(Date.now() + i * 86400000).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-2 pt-4">
              {i === 1 && (
                <div className="bg-primary/10 border border-primary/20 text-primary text-xs p-2 rounded">
                  <p className="font-semibold">10:00 - Corte de Pelo</p>
                  <p>Juan Pérez</p>
                </div>
              )}
              {i === 2 && (
                <div className="bg-primary/10 border border-primary/20 text-primary text-xs p-2 rounded">
                  <p className="font-semibold">15:30 - Tintura</p>
                  <p>María Gómez</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
