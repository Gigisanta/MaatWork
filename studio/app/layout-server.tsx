import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { DesktopSidebar, MobileNav, NavItem } from "@maatwork/ui";
import { LayoutDashboard, Users, GitMerge, Receipt } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Maatwork Studio",
  description: "Internal HQ for Maatwork",
};

const studioNav: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Pipeline", href: "/pipeline", icon: GitMerge },
  { title: "Apps", href: "/apps", icon: Users },
  { title: "Billing", href: "/billing", icon: Receipt },
];

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans flex flex-col md:flex-row min-h-screen selection:bg-primary selection:text-primary-foreground bg-background text-foreground">
        <MobileNav items={studioNav} title="Maatwork HQ" />
        <DesktopSidebar items={studioNav} title="Maatwork HQ" />
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
