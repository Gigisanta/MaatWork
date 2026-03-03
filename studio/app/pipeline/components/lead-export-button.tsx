"use client";

import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@maatwork/ui";
import { Download, FileDown, FileJson } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { exportLeadsAction } from "../export-actions";
import { toast } from "sonner";

export function LeadExportButton() {
  const { execute, isPending } = useAction(exportLeadsAction, {
    onSuccess: ({ data }) => {
      if (!data) return;
      
      const blob = new Blob([data.data], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success(`Leads exportados correctamente: ${data.fileName}`);
    },
    onError: () => toast.error("Error al exportar leads"),
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-white/5 border-white/10 hover:bg-white/10" disabled={isPending}>
          <Download className="w-4 h-4" />
          {isPending ? "Exportando..." : "Exportar"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black/80 backdrop-blur-xl border-white/10">
        <DropdownMenuItem onClick={() => execute({ format: "csv" })} className="gap-2 cursor-pointer">
          <FileDown className="w-4 h-4" />
          CSV (HubSpot/Salesforce)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => execute({ format: "json" })} className="gap-2 cursor-pointer">
          <FileJson className="w-4 h-4" />
          JSON (Custom API)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
