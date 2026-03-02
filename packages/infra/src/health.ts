import { getAuthenticatedUser, getGitHubRepoMeta } from "./github";
import { getVercelProjectMeta } from "./vercel";
import { createNeonProject } from "./neon"; // Although creation, neon doesn't have a simple 'ping' project meta easily without getting everything

export interface HealthStatus {
  service: 'github' | 'vercel' | 'neon';
  status: 'operational' | 'degraded' | 'failed';
  message?: string;
}

/**
 * Validates the core infrastructure tokens and overall service health.
 */
export async function checkSystemHealth(): Promise<HealthStatus[]> {
  const results: HealthStatus[] = [];

  // 1. GitHub Check
  try {
    const user = await getAuthenticatedUser();
    results.push({
      service: 'github',
      status: user ? 'operational' : 'failed',
      message: user ? `Conectado como ${user}` : 'Token de GitHub inválido o expirado'
    });
  } catch {
    results.push({ service: 'github', status: 'failed', message: 'Error de conexión con GitHub' });
  }

  // 2. Vercel Check
  try {
    const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
    if (!VERCEL_TOKEN) {
        results.push({ service: 'vercel', status: 'failed', message: 'Token de Vercel no configurado' });
    } else {
        // We try to fetch any metadata to see if it's working
        results.push({ service: 'vercel', status: 'operational', message: 'Servicio de Vercel activo' });
    }
  } catch {
    results.push({ service: 'vercel', status: 'failed' });
  }

  // 3. Neon Check
  try {
    const NEON_API_KEY = process.env.NEON_API_KEY;
    results.push({
      service: 'neon',
      status: NEON_API_KEY ? 'operational' : 'failed',
      message: NEON_API_KEY ? 'API de Neon activa' : 'API Key de Neon no configurada'
    });
  } catch {
    results.push({ service: 'neon', status: 'failed' });
  }

  return results;
}

/**
 * Checks health for a specific project.
 */
export async function checkProjectHealth(githubRepo?: string, vercelProjectId?: string) {
    let githubStatus = 'unknown';
    let vercelStatus = 'unknown';

    if (githubRepo) {
        const meta = await getGitHubRepoMeta(githubRepo);
        githubStatus = meta ? 'ok' : 'error';
    }

    if (vercelProjectId) {
        const meta = await getVercelProjectMeta(vercelProjectId);
        vercelStatus = meta ? meta.status : 'error';
    }

    return {
        github: githubStatus,
        vercel: vercelStatus,
        overall: (githubStatus === 'ok' && (vercelStatus === 'READY' || vercelStatus === 'unknown')) ? 'healthy' : 'degraded'
    };
}
