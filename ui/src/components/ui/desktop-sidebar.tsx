"use client";

import { NavMain, NavItem } from "./nav-main";
import { cn } from "../../lib/utils";

interface DesktopSidebarProps {
  items: NavItem[];
  title: string;
  footer?: React.ReactNode;
}

export function DesktopSidebar({ items, title, footer }: DesktopSidebarProps) {
  return (
    <aside className="w-full flex flex-col h-full bg-transparent">
      {title && (
        <div className="flex h-14 items-center px-6 font-bold text-lg">
          {title}
        </div>
      )}
      <div className="flex-1 overflow-auto">
        <NavMain items={items} />
      </div>
      {footer && (
        <div className="p-4 border-t border-muted-foreground/10">
          {footer}
        </div>
      )}
    </aside>
  );
}
