"use client";

import * as React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  Separator
} from "@maatwork/ui";
import { Building2, Globe, LayoutDashboard } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface App {
  id: string;
  name: string;
  slug: string;
}

interface HubContextSwitcherProps {
  apps: App[];
  currentApp?: string;
}

export function HubContextSwitcher({ apps, currentApp }: HubContextSwitcherProps) {
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleValueChange = (value: string) => {
    if (value === "global") {
      router.push("/");
    } else {
      // Management Mode: Stay within studio app for founder convenience
      router.push(`/${value}`);
    }
  };

  if (!mounted) {
    return (
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 mb-2 px-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Contexto del Hub
          </span>
        </div>
        <div className="w-full h-10 bg-background/50 border border-muted-foreground/20 rounded-md animate-pulse" />
      </div>
    );
  }

  return (
    <div className="px-3 py-2">
      <div className="flex items-center gap-2 mb-2 px-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Contexto del Hub
        </span>
      </div>
      <Select 
        defaultValue={pathname.split('/')[1] || currentApp || "global"} 
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-full bg-background/50 border-muted-foreground/20 hover:bg-accent transition-colors">
          <SelectValue placeholder="Seleccionar Contexto" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="global">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>MaatWork HQ (Global)</span>
            </div>
          </SelectItem>
          <Separator className="my-1" />
          {apps.map((t) => (
            <SelectItem key={t.id} value={t.slug}>
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span>{t.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
