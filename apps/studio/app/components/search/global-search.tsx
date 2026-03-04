"use client";

import { useEffect, useState } from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    useDebounce
} from "@maatwork/ui";
import { useRouter } from "next/navigation";
import { Building2, Users, GitMerge, Search } from "lucide-react";
import { globalSearchAction } from "./search-actions";

export function GlobalSearch() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 300);
    const [results, setResults] = useState<{ apps: any[], clients: any[], leads: any[] }>({ apps: [], clients: [], leads: [] });
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        }
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    useEffect(() => {
        if (debouncedQuery.length > 1) {
            globalSearchAction(debouncedQuery).then(setResults);
        } else {
            setResults({ apps: [], clients: [], leads: [] });
        }
    }, [debouncedQuery]);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-white/40 hover:bg-white/[0.05] transition-all"
            >
                <Search className="w-3.5 h-3.5" />
                <span>Buscar...</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-white/20 opacity-100 ml-2">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Busca apps, clientes o leads..." onValueChange={setQuery} />
                <CommandList className="bg-black/90 backdrop-blur-3xl border-t border-white/5">
                    <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                    {results.apps.length > 0 && (
                        <CommandGroup heading="Aplicaciones">
                            {results.apps.map(app => (
                                <CommandItem key={app.id} onSelect={() => runCommand(() => router.push(`/apps/${app.id}`))}>
                                    <Building2 className="mr-2 h-4 w-4" />
                                    <span>{app.name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                    {results.clients.length > 0 && (
                        <CommandGroup heading="Clientes">
                            {results.clients.map(client => (
                                <CommandItem key={client.id} onSelect={() => runCommand(() => router.push(`/clients`))}>
                                    <Users className="mr-2 h-4 w-4" />
                                    <span>{client.name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                    {results.leads.length > 0 && (
                        <CommandGroup heading="Leads (Pipeline)">
                            {results.leads.map(lead => (
                                <CommandItem key={lead.id} onSelect={() => runCommand(() => router.push(`/pipeline`))}>
                                    <GitMerge className="mr-2 h-4 w-4" />
                                    <span>{lead.name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}
