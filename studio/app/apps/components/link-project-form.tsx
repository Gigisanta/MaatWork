"use client";

import { useState } from "react";
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@maatwork/ui";
import { Github, Globe, Save, Link as LinkIcon } from "lucide-react";
import { updateProjectHubAction } from "../actions";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

interface LinkProjectFormProps {
  appId: string;
  initialGithub?: string | null;
  initialVercelId?: string | null;
  initialVercelUrl?: string | null;
  initialNeonUrl?: string | null;
}

export function LinkProjectForm({ appId, initialGithub, initialVercelId, initialVercelUrl, initialNeonUrl }: LinkProjectFormProps) {
  const [github, setGithub] = useState(initialGithub || "");
  const [vercelId, setVercelId] = useState(initialVercelId || "");
  const [vercelUrl, setVercelUrl] = useState(initialVercelUrl || "");
  const [neonUrl, setNeonUrl] = useState(initialNeonUrl || "");

  const { execute, isExecuting } = useAction(updateProjectHubAction, {
    onSuccess: () => {
      toast.success("Proyecto vinculado correctamente");
    },
    onError: () => {
      toast.error("Error al vincular el proyecto");
    }
  });

  return (
    <Card className="border-white/5 bg-black/40 backdrop-blur-3xl">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Vincular App
        </CardTitle>
        <CardDescription>Configura los repositorios y despliegues.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
            <Github className="h-3 w-3" /> GitHub Repo (user/repo)
          </label>
          <Input 
            value={github} 
            onChange={(e) => setGithub(e.target.value)} 
            placeholder="maatwork/planning"
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
            Vercel Project ID
          </label>
          <Input 
            value={vercelId} 
            onChange={(e) => setVercelId(e.target.value)} 
            placeholder="prj_..."
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
            <Globe className="h-3 w-3" /> Vercel URL
          </label>
          <Input 
            value={vercelUrl} 
            onChange={(e) => setVercelUrl(e.target.value)} 
            placeholder="https://planning.maat.work"
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
            Neon Database URL
          </label>
          <Input 
            value={neonUrl} 
            onChange={(e) => setNeonUrl(e.target.value)} 
            placeholder="https://console.neon.tech/..."
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
        <Button 
          className="w-full bg-primary/20 hover:bg-primary/30 border-primary/20 text-white font-bold"
          onClick={() => execute({ appId, githubRepo: github, vercelProjectId: vercelId, vercelUrl, neonUrl })}
          disabled={isExecuting}
        >
          <Save className="h-4 w-4 mr-2" />
          {isExecuting ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </CardContent>
    </Card>
  );
}
