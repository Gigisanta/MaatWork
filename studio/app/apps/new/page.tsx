"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Select, SelectContent,SelectItem, SelectTrigger, SelectValue, Checkbox } from "@maatwork/ui";
import { useAction } from "next-safe-action/hooks";
import { createAppAction } from "../actions";
import { toast } from "sonner";
import { Rocket, Building2, Globe, Layout, Github, Activity } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { getTemplates } from "../../templates/actions";
import { useSearchParams } from "next/navigation";

const schema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  slug: z.string().min(3, "Mínimo 3 caracteres").regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  template: z.string().min(1, "Selecciona una plantilla"),
  githubRepo: z.string().optional(),
  vercelProjectId: z.string().optional(),
  vercelUrl: z.string().optional(),
  neonUrl: z.string().optional(),
  isInternal: z.boolean().optional(),
  autoProvision: z.boolean().optional(),
  templateRepo: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewAppPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Cargando formulario...</div>}>
            <NewAppForm />
        </Suspense>
    );
}

function NewAppForm() {
  const searchParams = useSearchParams();
  const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);

  useEffect(() => {
    getTemplates().then(setAvailableTemplates);
  }, []);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: searchParams.get("name") || "",
      slug: searchParams.get("slug") || "",
      autoProvision: true,
    }
  });

  const autoProvision = watch("autoProvision");
  const selectedTemplateId = watch("template");

  // Update templateRepo when template changes
  useEffect(() => {
    if (autoProvision && selectedTemplateId) {
        const t = availableTemplates.find(x => x.id === selectedTemplateId);
        if (t) setValue("templateRepo", t.githubRepo);
    }
  }, [selectedTemplateId, autoProvision, availableTemplates, setValue]);

  const { execute, isPending } = useAction(createAppAction, {
    onSuccess: () => toast.success("Centro creado y provisionado con éxito"),
    onError: ({ error }) => toast.error(error.serverError || "Error al crear el centro"),
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Desplegar Nuevo Centro</h1>
        <p className="text-muted-foreground">Provisionamiento automático de base de datos, subdominio y plantilla.</p>
      </div>

      <Card className="border-primary/20 bg-card/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Configuración Core
          </CardTitle>
          <CardDescription>Define la identidad y el motor de este nuevo centro.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => execute(data))} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Nombre Comercial
              </Label>
              <Input id="name" {...register("name")} placeholder="Ej: Natatorio Central" className="bg-background/50" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="flex items-center gap-2">
                <Globe className="w-4 h-4" /> Subdominio personalizado
              </Label>
              <div className="flex items-center gap-2">
                <Input id="slug" {...register("slug")} placeholder="natatorio-central" className="bg-background/50" />
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">.maat.work</span>
              </div>
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="template" className="flex items-center gap-2">
                <Layout className="w-4 h-4" /> Business Template
              </Label>
              <Select onValueChange={(v) => setValue("template", v)}>
                <SelectTrigger id="template" className="bg-background/50">
                  <SelectValue placeholder="Selecciona una plantilla" />
                </SelectTrigger>
                <SelectContent>
                  {availableTemplates.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                  {availableTemplates.length === 0 && (
                    <SelectItem value="base" disabled>Cargando plantillas...</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.template && <p className="text-xs text-destructive">{errors.template.message}</p>}
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        App Hub & Automatización
                    </h3>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="autoProvision"
                            checked={autoProvision}
                            onCheckedChange={(checked) => setValue("autoProvision", !!checked)}
                        />
                        <Label htmlFor="autoProvision" className="text-xs font-bold text-primary cursor-pointer">Auto-Provisioning</Label>
                    </div>
                </div>

                {autoProvision ? (
                    <div className="space-y-4 bg-primary/5 p-4 rounded-lg border border-primary/10">
                        <div className="space-y-2">
                            <Label htmlFor="templateRepo" className="flex items-center gap-2 text-xs uppercase tracking-tighter text-white/40">
                                <Github className="w-3 h-3" /> Template Repository Source
                            </Label>
                            <Input id="templateRepo" {...register("templateRepo")} placeholder="maatwork/template-base" className="bg-background/50 h-8 text-xs" />
                            <p className="text-[10px] text-muted-foreground italic">Se creará un nuevo repo, proyecto en Vercel y DB en Neon automáticamente.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="githubRepo" className="flex items-center gap-2 text-xs uppercase tracking-tighter text-white/40">
                                    <Github className="w-3 h-3" /> GitHub Repo
                                </Label>
                                <Input id="githubRepo" {...register("githubRepo")} placeholder="user/repo" className="bg-background/50 h-8 text-xs" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vercelProjectId" className="flex items-center gap-2 text-xs uppercase tracking-tighter text-white/40">
                                    Vercel Project
                                </Label>
                                <Input id="vercelProjectId" {...register("vercelProjectId")} placeholder="prj_..." className="bg-background/50 h-8 text-xs" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="neonUrl" className="flex items-center gap-2 text-xs uppercase tracking-tighter text-white/40">
                                    Neon Database URL
                                </Label>
                                <Input id="neonUrl" {...register("neonUrl")} placeholder="https://console.neon.tech/..." className="bg-background/50 h-8 text-xs" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="vercelUrl" className="flex items-center gap-2 text-xs uppercase tracking-tighter text-white/40">
                                Vercel Production URL
                            </Label>
                            <Input id="vercelUrl" {...register("vercelUrl")} placeholder="https://..." className="bg-background/50 h-8 text-xs" />
                        </div>
                    </>
                )}

                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox 
                        id="isInternal" 
                        onCheckedChange={(checked) => setValue("isInternal", !!checked)}
                    />
                    <label
                        htmlFor="isInternal"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors cursor-pointer"
                    >
                        Esta es una aplicación propia (Internal App)
                    </label>
                </div>
            </div>

            <Button type="submit" className="w-full gap-2" size="lg" disabled={isPending}>
              <Rocket className="w-4 h-4" />
              {isPending ? "Provisionando..." : "Lanzar Centro"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-lg border bg-card/30">
          <div className="text-xl font-bold text-primary">8min</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Provisioning</div>
        </div>
        <div className="p-4 rounded-lg border bg-card/30">
          <div className="text-xl font-bold text-primary">SSL</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Automatic</div>
        </div>
        <div className="p-4 rounded-lg border bg-card/30">
          <div className="text-xl font-bold text-primary">DB</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Isolating</div>
        </div>
      </div>
    </div>
  );
}
