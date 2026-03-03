"use client";

import { useState } from "react";
import { updateLeadStatus, getLeadById } from "../lead-actions";
import { toast } from "sonner";
import { KanbanCard } from "./kanban-card";
import { LeadDetailSheet } from "./lead-detail-sheet";
import { Input } from "@maatwork/ui";
import { Search, Filter, Kanban as KanbanIcon } from "lucide-react";

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'system';
  content: string;
  createdAt: Date;
}

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  status: "new" | "contacted" | "proposal" | "won" | "lost";
  value: string | null;
  notes: string | null;
  createdAt: Date | null;
  activities?: Activity[];
}

const STAGES = [
  { id: "new", title: "Nuevos" },
  { id: "contacted", title: "Contactados" },
  { id: "proposal", title: "Propuesta" },
  { id: "won", title: "Ganados" },
];

export function KanbanBoard({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads || []);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLeadId(id);
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    
    if (id) {
      const leadToUpdate = leads.find(l => l.id === id);
      if (leadToUpdate?.status === stageId) return;

      // Optimistic update
      const prevLeads = [...leads];
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: stageId as any } : l)));
      
      const result = await updateLeadStatus(id, stageId as any);
      
      if (!result.success) {
        setLeads(prevLeads);
        toast.error("Error al actualizar estado del lead");
      } else {
        toast.success(`Lead movido a ${STAGES.find(s => s.id === stageId)?.title}`);
        // Refresh lead details if open
        if (selectedLead?.id === id) {
          refreshSelectedLead(id);
        }
      }
    }
    setDraggedLeadId(null);
  };

  const handleCardClick = async (lead: Lead) => {
    setSelectedLead(lead);
    setIsSheetOpen(true);
    // Fetch full details including activities
    refreshSelectedLead(lead.id);
  };

  const refreshSelectedLead = async (id: string) => {
    const fullLead = await getLeadById(id);
    if (fullLead) {
      setSelectedLead(fullLead as any);
      setLeads(prev => prev.map(l => l.id === id ? (fullLead as any) : l));
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (lead.company?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (lead.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col flex-1 h-full gap-6">
      {/* Mini Controls Bar */}
      <div className="flex gap-4 items-center bg-white/[0.03] p-2 rounded-2xl border border-white/5 backdrop-blur-md">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <Input 
            placeholder="Buscar leads..." 
            className="bg-black/20 border-white/5 pl-9 h-9 text-xs focus-visible:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="h-4 w-[1px] bg-white/10" />
        <div className="flex items-center gap-2 px-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
          <KanbanIcon className="w-3 h-3" />
          Vista Pipeline
        </div>
      </div>

      <div className="flex gap-4 flex-1 overflow-x-auto pb-4 custom-scrollbar">
        {STAGES.map((stage) => (
          <div
            key={stage.id}
            className="flex-1 min-w-[320px] bg-white/[0.02] border border-white/5 rounded-3xl p-4 flex flex-col gap-4 transition-colors duration-500 hover:bg-white/[0.03]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className="flex items-center justify-between mb-2 px-2">
              <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-white/50">{stage.title}</h3>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 text-white/40 font-mono border border-white/5">
                {filteredLeads.filter(l => l.status === stage.id).length}
              </span>
            </div>
            
            <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
              {filteredLeads
                .filter((l) => l.status === stage.id)
                .map((lead) => (
                  <KanbanCard 
                    key={lead.id}
                    lead={lead}
                    onDragStart={handleDragStart}
                    draggedLeadId={draggedLeadId}
                    onClick={handleCardClick}
                  />
                ))}
              
              {filteredLeads.filter(l => l.status === stage.id).length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl py-12 opacity-30 select-none">
                  <p className="text-[10px] italic font-light tracking-wide">Sin contactos en esta etapa</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <LeadDetailSheet 
        lead={selectedLead}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onRefresh={() => selectedLead && refreshSelectedLead(selectedLead.id)}
      />
    </div>
  );
}
