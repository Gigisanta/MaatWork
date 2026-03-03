import { getTemplates } from './actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Badge,
} from '@maatwork/ui';
import { Github, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { DeleteTemplateButton } from './components/delete-template-button';

interface TemplateData {
  id: string;
  name: string;
  githubRepo: string;
  description: string | null;
  category: string | null;
}

export default async function TemplatesPage() {
  const allTemplates: TemplateData[] = await getTemplates();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Gestión de Plantillas
          </h1>
          <p className="text-muted-foreground italic text-sm">
            Define los núcleos de software que vendes a tus clientes.
          </p>
        </div>
        <Link href="/templates/new">
          <Button className="bg-primary/20 hover:bg-primary/30 border-primary/20 text-white backdrop-blur-3xl transition-all">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Plantilla
          </Button>
        </Link>
      </div>

      <div className="border border-white/5 rounded-xl bg-black/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.02]">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest">
                ID
              </TableHead>
              <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest">
                Nombre
              </TableHead>
              <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest">
                GitHub Source
              </TableHead>
              <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest">
                Categoría
              </TableHead>
              <TableHead className="text-right text-white/40 uppercase text-[10px] font-black tracking-widest">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allTemplates.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground italic"
                >
                  No has registrado plantillas todavía.
                </TableCell>
              </TableRow>
            ) : (
              allTemplates.map((t: TemplateData) => (
                <TableRow
                  key={t.id}
                  className="border-white/5 hover:bg-white/[0.01] transition-colors group"
                >
                  <TableCell className="font-mono text-xs text-white/40">
                    {t.id}
                  </TableCell>
                  <TableCell className="font-medium text-white/90">
                    {t.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-white/60">
                      <Github className="w-3.5 h-3.5" />
                      {t.githubRepo}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="capitalize border-white/10 text-white/40"
                    >
                      {t.category || 'General'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DeleteTemplateButton id={t.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
