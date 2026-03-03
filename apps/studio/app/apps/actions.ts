"use server";

import { z } from "zod";
import { founderActionClient } from "@maatwork/auth/safe-action";
import { db } from "@maatwork/database";
import { apps, users, pricing_plans, app_subscriptions, activity_logs, audit_logs, app_invoices } from "@maatwork/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createRepoFromTemplate,
  getGitHubRepoMeta,
  createVercelProject,
  setVercelEnvVar,
  createNeonProject
} from "@maatwork/infra";

const createAppSchema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  slug: z.string().min(3, "Subdominio muy corto").regex(/^[a-z0-9-]+$/),
  template: z.string(),
  githubRepo: z.string().optional(),
  vercelProjectId: z.string().optional(),
  vercelUrl: z.string().optional(),
  neonUrl: z.string().optional(),
  isInternal: z.boolean().default(false),
  autoProvision: z.boolean().default(false),
  templateRepo: z.string().optional(),
});

export const createAppAction = founderActionClient
  .schema(createAppSchema)
  .action(async ({ parsedInput: { name, slug, template, githubRepo, vercelProjectId, vercelUrl, neonUrl, isInternal, autoProvision, templateRepo }, ctx: { session } }) => {
    // 1. Validate Uniqueness
    const existing = await db.query.apps.findFirst({
        where: (t, { eq }) => eq(t.slug, slug)
    });
    
    if (existing) {
        throw new Error("El subdominio ya está en uso.");
    }

    let finalGithubRepo = githubRepo;
    let finalVercelProjectId = vercelProjectId;
    let finalVercelUrl = vercelUrl;
    let finalNeonUrl = neonUrl;
    let finalNeonProjectId = undefined;
    let provisioningStatus: 'pending' | 'active' | 'failed' = 'pending';
    let templateCommitSha = undefined;

    // 2. Automated Provisioning if requested
    if (autoProvision && templateRepo) {
        provisioningStatus = 'active';
        console.log(`[PROVISIONING] Starting auto-provisioning for ${slug}...`);

        try {
            // A. Neon Project Creation
            const neonProject = await createNeonProject(`maat-${slug}`);
            if (neonProject) {
                finalNeonUrl = neonProject.connection_uri;
                finalNeonProjectId = neonProject.id;
                console.log(`[PROVISIONING] Neon project created: ${neonProject.id}`);
            }

            // B. GitHub Repo from Template
            const newRepoName = `maat-${slug}`;
            const createdRepo = await createRepoFromTemplate(templateRepo, newRepoName);
            if (createdRepo) {
                finalGithubRepo = createdRepo;
                console.log(`[PROVISIONING] GitHub repo created: ${createdRepo}`);

                // Get Initial Template SHA for future syncs
                const repoMeta = await getGitHubRepoMeta(createdRepo);
                if (repoMeta) {
                    templateCommitSha = repoMeta.lastCommitSha;
                }

                // C. Vercel Project Linking
                const vercelProject = await createVercelProject(`maat-${slug}`, createdRepo);
                if (vercelProject) {
                    finalVercelProjectId = vercelProject.id;
                    finalVercelUrl = vercelProject.url;
                    console.log(`[PROVISIONING] Vercel project created: ${vercelProject.id}`);

                    // D. Set Environment Variables in Vercel
                    if (finalNeonUrl) {
                        await setVercelEnvVar(vercelProject.id, "DATABASE_URL", finalNeonUrl);
                    }
                    await setVercelEnvVar(vercelProject.id, "NEXT_PUBLIC_APP_URL", `https://${slug}.maat.work`);
                }
            }
        } catch (error) {
            console.error("[PROVISIONING ERROR]", error);
            provisioningStatus = 'failed';
        }
    }

    const appId = crypto.randomUUID();

    // 3. ACID Transaction for Core Onboarding
    await db.transaction(async (tx) => {
      // Create App
      await tx.insert(apps).values({
        id: appId,
        name,
        slug,
        template,
        githubRepo: finalGithubRepo,
        vercelProjectId: finalVercelProjectId,
        vercelUrl: finalVercelUrl,
        neonUrl: finalNeonUrl,
        neonProjectId: finalNeonProjectId,
        provisioningStatus,
        templateCommitSha,
        isInternal,
      });

      // Auto-create HQ Admin for this app (using a system/placeholder email for now)
      const adminId = crypto.randomUUID();
      await tx.insert(users).values({
        id: adminId,
        appId: appId,
        email: `admin@${slug}.maat.work`,
        name: `Admin ${name}`,
        role: "admin",
      });

      // Seed Default Pricing based on template
      const defaultPrice = template === "natatorio" ? "45000" : "25000";
      await tx.insert(pricing_plans).values({
        id: crypto.randomUUID(),
        appId: appId,
        name: "Plan Initial",
        price: defaultPrice,
        features: { onboarding: true, priority: "normal" }
      });

      // Set initial subscription status
      await tx.insert(app_subscriptions).values({
        id: crypto.randomUUID(),
        appId: appId,
        planId: "pro_yearly",
        status: "active",
      });

      // Log the event
      await tx.insert(activity_logs).values({
        id: crypto.randomUUID(),
        appId: appId,
        userId: session.user.id,
        action: "APP_LAUNCHED",
        details: { name, template, autoProvision, timestamp: new Date().toISOString() }
      });

      // 4. Initial Setup Invoice (Lead Lifecycle Close)
      await tx.insert(app_invoices).values({
        id: crypto.randomUUID(),
        appId: appId,
        amount: "50000.00", // Default Setup Fee
        currency: "ARS",
        status: "open",
      });

      // Audit Log
      await tx.insert(audit_logs).values({
        id: crypto.randomUUID(),
        appId: appId,
        userId: session.user.id,
        action: autoProvision ? "app.provisioned" : "app.created",
        entityType: "apps",
        entityId: appId,
        metadata: { name, slug, template, autoProvision },
        createdAt: new Date(),
      });
    });

    console.log(`[FOUNDER ENGINE] Center ${slug} successfully launched and seeded.`);

    revalidatePath("/apps");
    redirect("/apps");
  });
const toggleAppStatusSchema = z.object({
  appId: z.string(),
  currentStatus: z.enum(["active", "past_due", "canceled", "trialing"]),
});

export const toggleAppStatusAction = founderActionClient
  .schema(toggleAppStatusSchema)
  .action(async ({ parsedInput: { appId, currentStatus }, ctx: { session } }) => {
    const newStatus = currentStatus === "active" ? "canceled" : "active";
    
    await db.update(app_subscriptions)
      .set({ status: newStatus })
      .where(eq(app_subscriptions.appId, appId));

    await db.insert(activity_logs).values({
      id: crypto.randomUUID(),
      appId: appId,
      userId: session.user.id,
      action: newStatus === "active" ? "APP_RESUMED" : "APP_PAUSED",
      details: { timestamp: new Date().toISOString() }
    });

    revalidatePath("/apps");
    return { success: true, newStatus };
  });

const updateProjectHubSchema = z.object({
  appId: z.string(),
  githubRepo: z.string().optional(),
  vercelProjectId: z.string().optional(),
  vercelUrl: z.string().optional(),
  neonUrl: z.string().optional(),
});

export const updateProjectHubAction = founderActionClient
  .schema(updateProjectHubSchema)
  .action(async ({ parsedInput: { appId, githubRepo, vercelProjectId, vercelUrl, neonUrl }, ctx: { session } }) => {
    await db.update(apps)
      .set({
        githubRepo,
        vercelProjectId,
        vercelUrl,
        neonUrl,
      })
      .where(eq(apps.id, appId));

    await db.insert(activity_logs).values({
      id: crypto.randomUUID(),
      appId: appId,
      userId: session.user.id,
      action: "PROJECT_HUB_LINKED",
      details: { githubRepo, vercelProjectId, neonUrl, timestamp: new Date().toISOString() }
    });

    revalidatePath(`/apps/${appId}`);
    return { success: true };
  });
