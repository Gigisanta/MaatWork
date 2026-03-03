'use client';

import { ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { DesktopSidebar, MobileNav, NavItem } from '@maatwork/ui';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Package,
  CreditCard,
  UsersRound,
  Settings,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

export default function AppManagementLayout({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams();
  const appSlug = params.appSlug as string;

  const appNav: NavItem[] = [
    { title: 'Dashboard', href: `/${appSlug}`, icon: LayoutDashboard },
    { title: 'Agenda', href: `/${appSlug}/agenda`, icon: Calendar },
    { title: 'Clientes', href: `/${appSlug}/clients`, icon: Users },
    {
      title: 'Suscripciones',
      href: `/${appSlug}/subscriptions`,
      icon: CreditCard,
    },
    { title: 'Grupos', href: `/${appSlug}/groups`, icon: UsersRound },
    { title: 'Inventario', href: `/${appSlug}/inventory`, icon: Package },
    { title: 'Configuración', href: `/${appSlug}/settings`, icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <MobileNav items={appNav} title={appSlug.toUpperCase()} />
      <DesktopSidebar items={appNav} title={appSlug.toUpperCase()} />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  );
}
