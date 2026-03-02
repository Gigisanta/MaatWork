"use client";

import { ReactNode } from "react";
import "./globals.css";
import { 
  DesktopSidebar, 
  MobileNav, 
  NavItem, 
  HubContextSwitcher 
} from "@maatwork/ui";
import { 
  LayoutDashboard, 
  Users, 
  GitMerge, 
  Receipt,
  Building2,
  ArrowLeftRight,
  Activity,
  ShieldAlert,
  BarChart3
} from "lucide-react";

interface App {
  id: string;
  name: string;
  slug: string;
}

const studioNav: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Pipeline", href: "/pipeline", icon: GitMerge },
  { title: "Apps", href: "/apps", icon: Building2 },
  { title: "Templates", href: "/templates", icon: LayoutDashboard },
  { title: "Salud", href: "/health", icon: Activity },
  { title: "Clientes", href: "/clients", icon: Users },
  { title: "Facturación", href: "/billing", icon: Receipt },
  { title: "Auditoría", href: "/audit", icon: ShieldAlert },
  { title: "Analytics", href: "/analytics", icon: BarChart3 }, // Added Analytics item
];

export default function HubLayoutClient({
  children,
  allApps
}: {
  children: ReactNode;
  allApps: App[];
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans bg-background text-foreground overflow-hidden">
        <div className="flex h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black">
          {/* Grainy Noise Overlay */}
          <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-50 mix-blend-overlay" />

          {/* Glass Sidebar */}
          <aside className="hidden md:flex w-72 flex-col border-r border-white/5 bg-black/40 backdrop-blur-3xl z-40">
            <div className="flex h-16 items-center border-b border-white/5 px-6 font-bold text-xl tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
              MaatWork Hub
            </div>
            
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
              <HubContextSwitcher apps={allApps} />
            </div>

            <div className="flex-1 overflow-auto py-8">
              <div className="px-6 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
                   Gestión Principal
                </span>
              </div>
              <DesktopSidebar items={studioNav} title="" />
            </div>
            
            <div className="p-4 border-t border-white/5 bg-black/20">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] text-white/80 border border-white/5 shadow-2xl transition-all hover:bg-white/[0.05] hover:border-white/10 group">
                <div className="p-1.5 rounded-lg bg-primary/20 text-primary group-hover:scale-110 transition-transform">
                  <ArrowLeftRight className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold tracking-wide uppercase">Modo Fundador</span>
              </div>
            </div>
          </aside>

          <div className="flex flex-col flex-1 min-w-0 relative">
            <header className="md:hidden flex h-16 items-center justify-between px-6 border-b border-white/5 bg-black/40 backdrop-blur-xl z-40">
               <div className="font-bold text-lg tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                MAATWORK
              </div>
              <MobileNav items={studioNav} title="MAATWORK HUB" />
            </header>
            
            <main className="flex-1 overflow-y-auto relative scroll-smooth">
              <div className="max-w-6xl mx-auto p-6 md:p-12 lg:p-16 animate-in fade-in duration-1000 slide-in-from-bottom-4">
                {children}
              </div>
            </main>

            {/* Subtle glow effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10 pointer-events-none opacity-50" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full -z-10 pointer-events-none opacity-30" />
          </div>
        </div>
      </body>
    </html>
  );
}
