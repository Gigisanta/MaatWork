"use server";

import { z } from "zod";
import { founderActionClient } from "@maatwork/auth/safe-action";
import { db } from "@maatwork/database";
import { tenants } from "@maatwork/database/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const createTenantSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  slug: z.string().min(3, "Subdomain must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens are allowed"),
  template: z.enum(["base", "natatorio", "peluqueria"], { message: "Invalid template selected" }),
});

export const createTenantAction = founderActionClient
  .schema(createTenantSchema)
  .action(async ({ parsedInput: { name, slug, template } }) => {
    // 1. Validate Uniqueness
    const existing = await db.query.tenants.findFirst({
        where: (t, { eq }) => eq(t.slug, slug)
    });
    
    if (existing) {
        throw new Error("A tenant with this subdomain already exists.");
    }

    // 2. Create the tenant in DB
    await db.insert(tenants).values({
      id: crypto.randomUUID(),
      name,
      slug,
      template,
    });

    // 3. Simulate Agent 8-min onboarding provision
    // In the real system, this might trigger a webhook or an MCP workflow
    console.log(`[AGENT ONBOARDING] Triggering onboarding flow for ${slug}...`);

    revalidatePath("/tenants");
    redirect("/tenants");
  });
