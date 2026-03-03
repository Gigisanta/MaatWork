"use client";

import { Button } from "@maatwork/ui";
import { Trash2 } from "lucide-react";
import { deleteTemplate } from "../actions";
import { toast } from "sonner";
import { useState } from "react";

export function DeleteTemplateButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de eliminar esta plantilla? Esto no borrará los proyectos de clientes asociados, pero ya no se podrá usar para nuevos proyectos.")) return;
        setIsDeleting(true);
        const res = await deleteTemplate(id);
        setIsDeleting(false);
        if (res.success) {
            toast.success("Plantilla eliminada correctamente");
        } else {
            toast.error("Error al eliminar la plantilla");
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            className="hover:bg-destructive/10 text-white/20 hover:text-destructive transition-all"
            onClick={handleDelete}
            disabled={isDeleting}
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    )
}
