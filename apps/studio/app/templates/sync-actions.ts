"use server";

import { db } from "@maatwork/database";
import { apps, templates, activity_logs } from "@maatwork/database/schema";
import { eq, and, ne } from "drizzle-orm";
import { compareCommits, createPullRequest, getGitHubRepoMeta } from "@maatwork/infra";
import { revalidatePath } from "next/cache";

/**
 * Checks if an app is out of sync with its base template.
 */
export async function checkAppSyncStatus(appId: string) {
  const app = await db.query.apps.findFirst({
    where: eq(apps.id, appId),
  });

  if (!app || !app.githubRepo || !app.templateCommitSha) {
    return { status: 'unknown' };
  }

  // Get the template's current repo
  const template = await db.query.templates.findFirst({
    where: eq(templates.id, app.template),
  });

  if (!template) return { status: 'no_template' };

  // Get latest commit from template
  const templateMeta = await getGitHubRepoMeta(template.githubRepo);
  if (!templateMeta || !templateMeta.lastCommitSha) return { status: 'fetch_error' };

  if (templateMeta.lastCommitSha === app.templateCommitSha) {
    return { status: 'synced', latestSha: templateMeta.lastCommitSha };
  }

  // Compare
  const comparison = await compareCommits(template.githubRepo, app.templateCommitSha, templateMeta.lastCommitSha);

  return {
    status: comparison?.behind_by ? 'out_of_sync' : 'synced',
    behindBy: comparison?.behind_by || 0,
    latestSha: templateMeta.lastCommitSha,
    currentSha: app.templateCommitSha
  };
}

/**
 * Creates a Sync PR from Template to App
 */
export async function syncAppWithTemplate(appId: string) {
  const app = await db.query.apps.findFirst({
    where: eq(apps.id, appId),
  });

  if (!app || !app.githubRepo || !app.template) return { success: false, error: 'App or Repo not found' };

  const template = await db.query.templates.findFirst({
    where: eq(templates.id, app.template),
  });

  if (!template) return { success: false, error: 'Template not found' };

  const templateMeta = await getGitHubRepoMeta(template.githubRepo);
  if (!templateMeta || !templateMeta.lastCommitSha) return { success: false, error: 'Could not fetch template meta' };

  // Logic: Create a PR from template:main to app:main
  // Note: GitHub API 'generate' doesn't keep a git history link,
  // so we might need a more complex strategy for "syncing" if they are different repos.
  // Standard way: Create a PR with the changes.

  const prUrl = await createPullRequest(
    app.githubRepo,
    "🚀 Maatwork Hub: Actualización de Plantilla Core",
    `${template.githubRepo.split('/')[0]}:main`, // This assumes cross-repo PR permission or same owner
    "main",
    "Esta es una actualización automática desde el Maatwork Hub para sincronizar mejoras de seguridad, performance o nuevas funcionalidades de la plantilla core."
  );

  if (prUrl) {
    // Update last sync attempt
    await db.update(apps)
      .set({
        lastSyncAt: new Date(),
        // We don't update templateCommitSha until the PR is merged,
        // but for simplicity in this MVP we might track the "target" sha.
      })
      .where(eq(apps.id, appId));

    revalidatePath(`/apps/${appId}`);
    return { success: true, prUrl };
  }

  return { success: false, error: 'Error al crear el Pull Request. Revisa permisos.' };
}
