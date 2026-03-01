import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Maatwork Client",
  description: "Client Management Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-gray-50 flex min-h-screen">
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
