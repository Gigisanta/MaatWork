"use client";

import { useEffect, useState } from "react";
import { checkAppSyncStatus, syncAppWithTemplate } from "../../templates/sync-actions";
import { Badge, Button } from "@maatwork/ui";
import { RefreshCcw, GitPullRequest, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function SyncStatus({ appId }: { appId: string }) {
    const [status, setStatus] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    const loadStatus = async () => {
        setIsLoading(true);
        const res = await checkAppSyncStatus(appId);
        setStatus(res);
        setIsLoading(false);
    };

    useEffect(() => {
        loadStatus();
    }, [appId]);

    const handleSync = async () => {
        setIsSyncing(true);
        const res = await syncAppWithTemplate(appId);
        setIsSyncing(false);
        if (res.success) {
            toast.success("Pull Request de sincronización creado!");
            if (res.prUrl) window.open(res.prUrl, '_blank');
            loadStatus();
        } else {
            toast.error(res.error || "Error al sincronizar");
        }
    };

    if (isLoading) return <div className="animate-pulse h-4 w-24 bg-white/5 rounded" />;

    if (status?.status === 'synced') {
        return (
            <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] text-green-500 border-green-500/20 bg-green-500/5">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Al día
                </Badge>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={loadStatus}>
                    <RefreshCcw className="w-3 h-3" />
                </Button>
            </div>
        );
    }

    if (status?.status === 'out_of_sync') {
        return (
            <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-[10px] text-yellow-500 border-yellow-500/20 bg-yellow-500/5">
                    <AlertTriangle className="w-3 h-3 mr-1" /> {status.behindBy} commits atrás
                </Badge>
                <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 text-[10px] uppercase font-black tracking-widest bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                    onClick={handleSync}
                    disabled={isSyncing}
                >
                    <GitPullRequest className="w-3 h-3 mr-1" />
                    {isSyncing ? "Sincronizando..." : "Sincronizar Plantilla"}
                </Button>
            </div>
        );
    }

    return null;
}
