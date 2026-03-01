import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Maatwork Studio",
  description: "Internal HQ for Maatwork",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans flex min-h-screen selection:bg-primary selection:text-primary-foreground">
        {/* Sidebar Nav */}
        <aside className="w-64 border-r bg-muted/20 p-4 flex flex-col gap-2">
          <div className="font-bold text-xl mb-6 px-2">Maatwork HQ</div>
          <a href="/" className="hover:bg-muted/50 px-2 py-1.5 rounded-md transition-colors text-sm font-medium">Dashboard</a>
          <a href="/pipeline" className="hover:bg-muted/50 px-2 py-1.5 rounded-md transition-colors text-sm font-medium">Pipeline</a>
          <a href="/tenants" className="hover:bg-muted/50 px-2 py-1.5 rounded-md transition-colors text-sm font-medium">Tenants</a>
          <a href="/billing" className="hover:bg-muted/50 px-2 py-1.5 rounded-md transition-colors text-sm font-medium">Billing</a>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
