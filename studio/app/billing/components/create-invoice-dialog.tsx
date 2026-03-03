"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@maatwork/ui";
import { Plus, Receipt } from "lucide-react";
import { createInvoiceAction } from "../billing-actions";
import { toast } from "sonner";

export function CreateInvoiceDialog({ apps }: { apps: { id: string, name: string }[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        setIsPending(true);
        const res = await createInvoiceAction({
            appId: formData.get('appId') as string,
            amount: formData.get('amount') as string,
            currency: formData.get('currency') as string,
        });
        setIsPending(false);

        if (res.success) {
            toast.success("Factura creada correctamente");
            setIsOpen(false);
        } else {
            toast.error("Error al crear la factura");
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary/20 hover:bg-primary/30 border-primary/20 text-white backdrop-blur-3xl">
                    <Plus className="w-4 h-4 mr-2" /> Nueva Factura
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/90 border-white/10 text-white backdrop-blur-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-primary" /> Crear Factura Manual
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label>Aplicación / Centro</Label>
                        <Select name="appId" required>
                            <SelectTrigger className="bg-white/5 border-white/10">
                                <SelectValue placeholder="Selecciona centro..." />
                            </SelectTrigger>
                            <SelectContent>
                                {apps.map(app => (
                                    <SelectItem key={app.id} value={app.id}>{app.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Monto</Label>
                            <Input name="amount" type="number" placeholder="0.00" className="bg-white/5 border-white/10" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Moneda</Label>
                            <Select name="currency" defaultValue="ARS">
                                <SelectTrigger className="bg-white/5 border-white/10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ARS">ARS</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Procesando..." : "Emitir Factura"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
