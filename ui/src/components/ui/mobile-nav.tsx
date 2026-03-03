"use client";

import { Menu } from "lucide-react";
import { Button } from "./button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./sheet";
import { NavMain, NavItem } from "./nav-main";
import { useState } from "react";

interface MobileNavProps {
  items: NavItem[];
  title: string;
}

export function MobileNav({ items, title }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center p-4 border-b bg-background sticky top-0 z-40">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <SheetHeader>
            <SheetTitle className="text-left px-2">{title}</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <NavMain items={items} onItemClick={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
      <div className="font-bold">{title}</div>
    </div>
  );
}
