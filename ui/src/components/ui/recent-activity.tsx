"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./card";

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: ReactNode;
  variant?: "default" | "success" | "warning" | "destructive";
}

interface RecentActivityProps {
  items: ActivityItem[];
  title?: string;
  description?: string;
  className?: string;
}

export function RecentActivity({ 
  items, 
  title = "Actividad Reciente", 
  description = "Últimas acciones realizadas en la plataforma.",
  className 
}: RecentActivityProps) {
  return (
    <Card className={cn("col-span-full xl:col-span-3", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-[18px] before:w-[2px] before:bg-muted">
          {items.map((item) => (
            <div key={item.id} className="relative flex gap-4 pl-1">
              <div className={cn(
                "relative z-10 flex h-9 w-9 items-center justify-center rounded-full border bg-background shadow-sm [&>svg]:h-4 [&>svg]:w-4",
                item.variant === "success" && "border-green-500/50 text-green-500",
                item.variant === "warning" && "border-yellow-500/50 text-yellow-500",
                item.variant === "destructive" && "border-red-500/50 text-red-500",
                !item.variant && "border-muted-foreground/20 text-muted-foreground"
              )}>
                {item.icon}
              </div>
              <div className="flex flex-col gap-1 pt-1 text-sm">
                <div className="font-medium leading-none">{item.title}</div>
                <div className="text-muted-foreground line-clamp-1">{item.description}</div>
                <div className="text-[10px] text-muted-foreground/60 uppercase font-bold tracking-wider">
                  {item.timestamp}
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-6 text-muted-foreground text-sm italic">
              No hay actividad reciente para mostrar.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
