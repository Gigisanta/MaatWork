"use client";

import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@maatwork/ui";
import { Lead, Activity } from "./kanban-board";
import { 
  Phone, 
  Mail, 
  Building, 
  DollarSign, 
  Clock, 
  Plus,
  MessageSquare,
  PhoneCall,
  Mail as MailIcon,
  Users,
  Settings,
  X,
  Rocket
} from "lucide-react";
import { Badge } from "@maatwork/ui";
import { Button } from "@maatwork/ui";
import { addLeadActivity } from "../lead-actions";
import { toast } from "sonner";
import { ActivityLogger } from "./activity-logger";
import Link from "next/link";

interface LeadDetailSheetProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export function LeadDetailSheet({ lead, isOpen, onClose, onRefresh }: LeadDetailSheetProps) {
  const [isLogging, setIsLogging] = useState(false);

  if (!lead) return null;

  const handleActivityLogged = () => {
    setIsLogging(false);
    onRefresh?.();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl bg-black/80 backdrop-blur-2xl border-white/10 text-white overflow-y-auto custom-scrollbar">
        <SheetHeader className="text-left space-y-4">
          <div className="flex justify-between items-start">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 uppercase tracking-widest text-[10px]">
              {lead.status}
            </Badge>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div>
            <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              {lead.name}
            </SheetTitle>
            {lead.company && (
              <SheetDescription className="text-white/40 flex items-center gap-1.5 mt-1">
                <Building className="w-4 h-4" />
                {lead.company}
              </SheetDescription>
            )}
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          {/* Contact Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                <Mail className="w-3 h-3" /> Email
              </div>
              <div className="text-sm font-medium text-white/80">{lead.email || "N/A"}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                <Phone className="w-3 h-3" /> Teléfono
              </div>
              <div className="text-sm font-medium text-white/80">{(lead as any).phone || "N/A"}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                <DollarSign className="w-3 h-3" /> Valor Estimado
              </div>
              <div className="text-sm font-medium text-green-400">
                ${lead.value ? Number(lead.value).toLocaleString() : "0"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> Creado
              </div>
              <div className="text-sm font-medium text-white/80">
                {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "N/A"}
              </div>
            </div>
          </div>

          {lead.status === 'won' && (
            <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-lg">¡Oportunidad Ganada!</h4>
                <p className="text-sm text-white/60">Este lead está listo para ser convertido en una aplicación activa.</p>
              </div>
              <Link href={`/apps/new?name=${encodeURIComponent(lead.name)}&slug=${encodeURIComponent(lead.company?.toLowerCase().replace(/[^a-z0-9]/g, '-') || '')}`}>
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold px-8">
                  Provisionar Aplicación
                </Button>
              </Link>
            </div>
          )}

          {/* Activity Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white/60">Actividad</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 border-white/10 bg-white/5 hover:bg-white/10"
                onClick={() => setIsLogging(!isLogging)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Registrar
              </Button>
            </div>

            {isLogging && (
              <ActivityLogger 
                leadId={lead.id} 
                onSuccess={handleActivityLogged}
                onCancel={() => setIsLogging(false)}
              />
            )}

            <div className="space-y-4 relative">
              <div className="absolute left-[17px] top-4 bottom-4 w-[1px] bg-white/10" />
              
              {lead.activities && lead.activities.length > 0 ? (
                lead.activities.map((activity, idx) => (
                  <div key={activity.id} className="flex gap-4 relative">
                    <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/5 flex items-center justify-center z-10 shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 pt-1 pb-4">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-white/40">
                          {getActivityLabel(activity.type)}
                        </span>
                        <span className="text-[10px] text-white/20">
                          {new Date(activity.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">
                        {activity.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl opacity-20">
                  <p className="text-xs italic">Sin actividad registrada</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'call': return <PhoneCall className="w-4 h-4 text-blue-400" />;
    case 'email': return <MailIcon className="w-4 h-4 text-yellow-400" />;
    case 'meeting': return <Users className="w-4 h-4 text-purple-400" />;
    case 'note': return <MessageSquare className="w-4 h-4 text-primary" />;
    case 'system': return <Settings className="w-4 h-4 text-white/40" />;
    default: return <MessageSquare className="w-4 h-4" />;
  }
}

function getActivityLabel(type: string) {
  switch (type) {
    case 'call': return 'Llamada';
    case 'email': return 'Email';
    case 'meeting': return 'Reunión';
    case 'note': return 'Nota';
    case 'system': return 'Sistema';
    default: return 'Actividad';
  }
}
