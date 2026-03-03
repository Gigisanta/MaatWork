"use client";

import { useState } from "react";
import { Button } from "@maatwork/ui";
import { Textarea } from "@maatwork/ui";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@maatwork/ui";
import { addLeadActivity } from "../lead-actions";
import { toast } from "sonner";
import { PhoneCall, Mail, Users, MessageSquare } from "lucide-react";

interface ActivityLoggerProps {
  leadId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ActivityLogger({ leadId, onSuccess, onCancel }: ActivityLoggerProps) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<any>("note");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    const result = await addLeadActivity(leadId, {
      type,
      content,
    });

    if (result.success) {
      toast.success("Actividad registrada");
      onSuccess();
    } else {
      toast.error("Error al registrar actividad");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 space-y-4 animate-in fade-in slide-in-from-top-2">
      <div className="flex gap-4">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[180px] bg-black/40 border-white/10 h-10">
            <SelectValue placeholder="Tipo de actividad" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 border-white/10 text-white">
            <SelectItem value="note" className="focus:bg-white/10">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span>Nota</span>
              </div>
            </SelectItem>
            <SelectItem value="call" className="focus:bg-white/10">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-blue-400" />
                <span>Llamada</span>
              </div>
            </SelectItem>
            <SelectItem value="email" className="focus:bg-white/10">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-yellow-400" />
                <span>Email</span>
              </div>
            </SelectItem>
            <SelectItem value="meeting" className="focus:bg-white/10">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Reunión</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Textarea 
        placeholder="Escribe los detalles de la interacción..."
        className="bg-black/40 border-white/10 min-h-[100px] resize-none focus-visible:ring-primary/20"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        autoFocus
      />

      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={onCancel}
          disabled={loading}
          className="text-white/40 hover:text-white"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          size="sm" 
          disabled={loading || !content.trim()}
          className="bg-primary hover:bg-primary/80 text-white font-bold"
        >
          {loading ? "Registrando..." : "Guardar Actividad"}
        </Button>
      </div>
    </form>
  );
}
