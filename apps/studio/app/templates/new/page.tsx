"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea
} from "@maatwork/ui";
import { createTemplate } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Github, Layers, FileText, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const schema = z.object({
  id: z.string().min(1, "ID requerido (ej: fitness-base)").regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  name: z.string().min(1, "Nombre requerido"),
  githubRepo: z.string().min(1, "Repositorio requerido (propietario/repo)"),
  description: z.string().optional(),
  category: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewTemplatePage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsPending(true);
    const result = await createTemplate(data);
    setIsPending(false);

    if (result.success) {
      toast.success("Plantilla registrada correctamente");
      router.push("/templates");
    } else {
      toast.error(result.error || "Error al registrar la plantilla");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-10">
      <div className="flex items-center gap-4">
        <Link href="/templates">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5" aria-label="Volver">
                <ArrowLeft className="w-5 h-5" />
            </Button>
        </Link>
        <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Registrar Plantilla Core
            </h1>
            <p className="text-muted-foreground text-sm">Define el repositorio base para nuevos proyectos de clientes.</p>
        </div>
      </div>

      <Card className="border-white/5 bg-black/40 backdrop-blur-3xl shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Layers className="w-5 h-5 text-primary" />
            Definición de Software
          </CardTitle>
          <CardDescription className="text-white/40 italic">Esta información se usará para el aprovisionamiento automático.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="id" className="text-xs font-black uppercase tracking-widest text-white/30">Identificador Único</Label>
                    <Input id="id" {...register("id")} placeholder="ej: fitness-core" className="bg-white/[0.02] border-white/5" />
                    {errors.id && <p className="text-xs text-destructive mt-1">{errors.id.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category" className="text-xs font-black uppercase tracking-widest text-white/30">Categoría</Label>
                    <Input id="category" {...register("category")} placeholder="ej: Fitness / SaaS" className="bg-white/[0.02] border-white/5" />
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-white/30">Nombre Comercial</Label>
              <Input id="name" {...register("name")} placeholder="Ej: Maatwork Natatorio Core" className="bg-white/[0.02] border-white/5" />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubRepo" className="text-xs font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                <Github className="w-3 h-3" /> Repositorio GitHub de Origen
              </Label>
              <Input id="githubRepo" {...register("githubRepo")} placeholder="giolivo/maatwork-base-template" className="bg-white/[0.02] border-white/5" />
              {errors.githubRepo && <p className="text-xs text-destructive mt-1">{errors.githubRepo.message}</p>}
              <p className="text-[10px] text-white/20 italic">Asegúrate de que el Maatwork Hub tenga acceso de lectura a este repo.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                <FileText className="w-3 h-3" /> Descripción y Notas
              </Label>
              <Textarea id="description" {...register("description")} placeholder="Describe qué incluye esta plantilla..." className="bg-white/[0.02] border-white/5 min-h-[100px]" />
            </div>

            <div className="pt-4 border-t border-white/5">
                <Button type="submit" className="w-full gap-2 bg-primary/20 hover:bg-primary/30 text-white border-primary/20 backdrop-blur-3xl" size="lg" disabled={isPending}>
                <Plus className="w-4 h-4" />
                {isPending ? "Registrando..." : "Guardar Plantilla Core"}
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
