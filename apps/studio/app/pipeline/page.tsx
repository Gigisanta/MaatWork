import { getLeads } from "./lead-actions";
import { KanbanBoard } from "./components/kanban-board";
import { Suspense } from "react";
import { Skeleton } from "@maatwork/ui";
import { LeadExportButton } from "./components/lead-export-button";

export default async function PipelinePage() {
  const initialLeads = await getLeads();

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Sales Pipeline
          </h1>
          <p className="text-muted-foreground italic text-sm">Gestiona leads y oportunidades de crecimiento.</p>
        </div>
        <LeadExportButton />
      </div>
      
      <Suspense fallback={<PipelineSkeleton />}>
        <KanbanBoard initialLeads={initialLeads} />
      </Suspense>
    </div>
  );
}

function PipelineSkeleton() {
  return (
    <div className="flex gap-4 flex-1 overflow-x-auto pb-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex-1 min-w-[300px] space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      ))}
    </div>
  );
}
