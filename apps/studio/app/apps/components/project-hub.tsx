import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button } from "@maatwork/ui";
import { Github, ExternalLink, GitBranch, Star, Activity, Database } from "lucide-react";
import { getGitHubRepoMeta, getVercelProjectMeta } from "@maatwork/infra";

import { ProjectHubProps } from "./project-hub-types";
import { LinkProjectForm } from "./link-project-form";
import { ShieldCheck } from "lucide-react";
import { SyncStatus } from "./sync-status";

export async function ProjectHub({ appId, githubRepo, vercelProjectId, vercelUrl, isInternal, neonUrl }: ProjectHubProps) {
  const githubMeta = githubRepo ? await getGitHubRepoMeta(githubRepo) : null;
  const vercelMeta = vercelProjectId ? await getVercelProjectMeta(vercelProjectId) : null;

  return (
    <Card className="border-white/5 bg-black/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            App Hub
          </div>
          {isInternal && (
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 flex items-center gap-1 text-[10px] uppercase font-black tracking-widest">
                <ShieldCheck className="h-3 w-3" /> Propia
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Gestión centralizada de código y despliegue.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* GitHub Section */}
        <div className="flex items-start gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/5">
          <div className="p-2 rounded-full bg-black border border-white/10">
            <Github className="h-6 w-6" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white/90">Repositorio GitHub</h4>
              <div className="flex items-center gap-2">
                {githubRepo && <SyncStatus appId={appId} />}
                {githubMeta && (
                  <Badge variant="outline" className="text-[10px] font-mono border-white/10 bg-white/5">
                    {githubMeta.lastCommit ? new Date(githubMeta.lastCommit).toLocaleDateString() : "No commits"}
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-sm text-white/40 font-mono">
              {githubRepo || "Sin vincular"}
            </p>
            {githubRepo && (
              <div className="flex items-center gap-4 pt-2">
                {githubMeta && (
                  <>
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <Star className="h-3 w-3 text-yellow-500" />
                      {githubMeta.stars}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <GitBranch className="h-3 w-3" />
                      {githubMeta.forks}
                    </div>
                  </>
                )}
                <Button variant="link" size="sm" className="h-auto p-0 text-primary" asChild>
                  <a href={githubMeta?.url || `https://github.com/${githubRepo}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    Ver en GitHub <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Vercel Section */}
        <div className="flex items-start gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/5">
          <div className="p-2 rounded-full bg-black border border-white/10">
            {/* Simple Vercel Icon approximation */}
            <svg width="24" height="24" viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-white">
              <path d="M37.5273 0L75.0546 65H0L37.5273 0Z" />
            </svg>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white/90">Despliegue Vercel</h4>
              {vercelMeta && (
                <Badge variant={vercelMeta.status === "READY" ? "default" : "destructive"} className="text-[10px] uppercase font-black tracking-tighter">
                  {vercelMeta.status}
                </Badge>
              )}
            </div>
            <p className="text-sm text-white/40 font-mono">
              {vercelProjectId || "Sin vincular"}
            </p>
            {(vercelUrl || vercelMeta?.url) && (
              <div className="flex items-center gap-4 pt-2">
                <Button variant="link" size="sm" className="h-auto p-0 text-primary" asChild>
                  <a href={vercelUrl || vercelMeta?.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    Ver Producción <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
                {vercelMeta && (
                    <span className="text-[10px] text-white/20 italic">
                        Sync: {new Date(vercelMeta.updatedAt).toLocaleTimeString()}
                    </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Edit Form (Collapsible/Optional) */}
        <div className="pt-4 border-t border-white/5">
            <LinkProjectForm 
                appId={appId}
                initialGithub={githubRepo}
                initialVercelId={vercelProjectId}
                initialVercelUrl={vercelUrl}
                initialNeonUrl={neonUrl}
            />
        </div>
        
        {/* Neon Section */}
        <div className="flex items-start gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/5">
          <div className="p-2 rounded-full bg-black border border-white/10 text-primary">
            <Database className="h-6 w-6" />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="font-semibold text-white/90">Neon Database</h4>
            <p className="text-sm text-white/40 font-mono truncate max-w-md">
              {neonUrl || "Sin vincular"}
            </p>
            {neonUrl && (
              <div className="pt-2">
                <Button variant="link" size="sm" className="h-auto p-0 text-primary" asChild>
                  <a href="https://console.neon.tech/app/projects" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    Ver en Neon Console <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
