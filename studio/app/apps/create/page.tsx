"use client";

import { useAction } from "next-safe-action/hooks";
import { createAppAction } from "../actions";
import { Button } from "@maatwork/ui";
import { Input } from "@maatwork/ui";
import { Label } from "@maatwork/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@maatwork/ui";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@maatwork/ui";
import { useState } from "react";
import Link from "next/link";
import { useToast } from "@maatwork/ui";

export default function CreateAppPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [template, setTemplate] = useState<"base" | "natatorio" | "peluqueria">("base");
  const { toast } = useToast();

  const { execute, isExecuting, result } = useAction(createAppAction as any, {
    onSuccess: () => {
      toast({
        title: "Client Onboarding Started",
        description: "The 8-minute provisioning process has been triggered.",
      });
    },
    onError: ({ error }) => {
      toast({
        title: "Error Creating App",
        description: error.serverError ? String(error.serverError) : "Validation or server error occurred.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    execute({ name, slug, template });
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Onboard New Client</CardTitle>
          <CardDescription>
            Provision a new instance for a Maatwork customer.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name (Razón Social)</Label>
              <Input
                id="name"
                placeholder="Acme Corp SRL"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">Subdomain (Slug)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="slug"
                  placeholder="acme-corp"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  autoComplete="off"
                />
                <span className="text-muted-foreground whitespace-nowrap">.maat.work</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Template Selection</Label>
              <Select value={template} onValueChange={(v: "base" | "natatorio" | "peluqueria") => setTemplate(v)}>
                <SelectTrigger id="template">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="base">Base CRM/ERP</SelectItem>
                  <SelectItem value="natatorio">Natatorio (NMS)</SelectItem>
                  <SelectItem value="peluqueria">Peluquería / Salón</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/apps">
              <Button variant="outline" type="button" disabled={isExecuting}>Cancel</Button>
            </Link>
            <Button type="submit" disabled={isExecuting}>
              {isExecuting ? "Provisioning..." : "Start Onboarding"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
