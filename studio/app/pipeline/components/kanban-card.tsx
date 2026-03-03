"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@maatwork/ui";
import { GlassCard } from "@maatwork/ui";
import { Lead } from "./kanban-board";
import { Calendar, Building, DollarSign, MessageSquare } from "lucide-react";

interface KanbanCardProps {
  lead: Lead;
  onDragStart: (e: React.DragEvent, id: string) => void;
  draggedLeadId: string | null;
  onClick: (lead: Lead) => void;
}

export function KanbanCard({ lead, onDragStart, draggedLeadId, onClick }: KanbanCardProps) {
  const lastActivity = lead.activities?.[0];

  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, lead.id)}
      onClick={() => onClick(lead)}
      className={`cursor-grab active:cursor-grabbing group border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 ${
        draggedLeadId === lead.id ? "opacity-20 scale-95" : "hover:scale-[1.02]"
      }`}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-sm font-semibold text-white/90 group-hover:text-primary transition-colors line-clamp-1">
            {lead.name}
          </CardTitle>
          {lead.value && (
            <span className="text-[10px] font-mono text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
              ${Number(lead.value).toLocaleString()}
            </span>
          )}
        </div>
        {lead.company && (
          <div className="flex items-center gap-1.5 text-[10px] text-white/30 mt-1">
            <Building className="w-3 h-3" />
            <span className="truncate">{lead.company}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {lastActivity && (
          <div className="mt-3 p-2 rounded-lg bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-1.5 text-[9px] text-white/40 uppercase tracking-wider mb-1">
              <MessageSquare className="w-2.5 h-2.5" />
              <span>Última Actividad</span>
            </div>
            <p className="text-[10px] text-white/60 line-clamp-2 italic">
              "{lastActivity.content}"
            </p>
          </div>
        )}
        
        <div className="text-[9px] text-white/20 flex justify-between items-center mt-3 border-t border-white/5 pt-3 uppercase tracking-widest">
          <span className="font-mono">ID: {lead.id.slice(-4)}</span>
          <div className="flex items-center gap-1">
            <Calendar className="w-2.5 h-2.5" />
            <span>{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
