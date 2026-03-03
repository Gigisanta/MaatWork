"use client";

import { Button } from "@maatwork/ui";
import { toggleAppStatusAction } from "../actions";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Power, PowerOff, Loader2 } from "lucide-react";

interface AppStatusToggleProps {
  appId: string;
  currentStatus: "active" | "past_due" | "canceled" | "trialing";
}

export function AppStatusToggle({ appId, currentStatus }: AppStatusToggleProps) {
  const { execute, status } = useAction(toggleAppStatusAction, {
    onSuccess: (data) => {
      toast.success(
        data.data?.newStatus === "active" 
          ? "Centro reanudado con éxito." 
          : "Centro pausado correctamente."
      );
    },
    onError: () => {
      toast.error("Error al cambiar el estado del centro.");
    }
  });

  const isLoading = status === "executing";
  const isActive = currentStatus === "active";

  return (
    <Button
      variant={isActive ? "outline" : "default"}
      size="sm"
      disabled={isLoading}
      onClick={() => execute({ appId, currentStatus })}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isActive ? (
        <PowerOff className="h-4 w-4 text-destructive" />
      ) : (
        <Power className="h-4 w-4 text-primary" />
      )}
      {isActive ? "Pausar" : "Reanudar"}
    </Button>
  );
}
