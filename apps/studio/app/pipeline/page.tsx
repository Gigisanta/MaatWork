"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@maatwork/ui";

const INITIAL_LEADS = [
  { id: "1", title: "Club de Natación Buenos Aires", stage: "new" },
  { id: "2", title: "Peluquería Estilo X", stage: "contacted" },
  { id: "3", title: "Gimnasio Acuático", stage: "proposal" },
  { id: "4", title: "Barbería los Hermanos", stage: "won" },
];

const STAGES = [
  { id: "new", title: "New Leads" },
  { id: "contacted", title: "Contacted" },
  { id: "proposal", title: "Proposal Sent" },
  { id: "won", title: "Closed Won" },
];

export default function PipelinePage() {
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLeadId(id);
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage: stageId } : l)));
    }
    setDraggedLeadId(null);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
      </div>
      
      <div className="flex gap-4 flex-1 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <div
            key={stage.id}
            className="flex-1 min-w-[250px] bg-muted/30 rounded-lg p-4 flex flex-col gap-3"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <h3 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wider">{stage.title}</h3>
            {leads
              .filter((l) => l.stage === stage.id)
              .map((lead) => (
                <Card
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  className={`cursor-grab active:cursor-grabbing transition-opacity ${
                    draggedLeadId === lead.id ? "opacity-50" : ""
                  }`}
                >
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base font-medium">{lead.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-xs text-muted-foreground flex justify-between">
                      <span>#Lead-{lead.id}</span>
                      <span>1d ago</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
