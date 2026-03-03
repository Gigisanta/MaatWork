import { db } from "@maatwork/database";
import { apps } from "@maatwork/database/schema";
import HubLayoutClient from "./layout-client";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  let allApps: any[] = [];
  try {
    allApps = await db.select().from(apps);
  } catch (error) {
    console.warn("Could not fetch apps, database might not be initialized:", error);
  }

  return (
    <HubLayoutClient allApps={allApps}>
      <div className="relative min-h-screen">
        {/* Background gradient for premium feel */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black -z-10" />
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none -z-10" />
        
        {children}
      </div>
    </HubLayoutClient>
  );
}
