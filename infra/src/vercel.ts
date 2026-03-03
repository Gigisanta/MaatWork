export interface VercelProjectMeta {
  status: "READY" | "ERROR" | "BUILDING" | "INITIALIZING";
  url: string;
  updatedAt: number;
}

const getTokens = () => ({
  VERCEL_TOKEN: process.env.VERCEL_TOKEN,
  VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID,
});

export async function getVercelProjectMeta(projectId: string): Promise<VercelProjectMeta | null> {
  const { VERCEL_TOKEN, VERCEL_TEAM_ID } = getTokens();
  if (!VERCEL_TOKEN) return null;

  try {
    const url = VERCEL_TEAM_ID
      ? `https://api.vercel.com/v9/projects/${projectId}?teamId=${VERCEL_TEAM_ID}`
      : `https://api.vercel.com/v9/projects/${projectId}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!res.ok) return null;

    const data = await res.json();

    // Get latest deployment
    const deployRes = await fetch(`https://api.vercel.com/v6/deployments?projectId=${projectId}${VERCEL_TEAM_ID ? `&teamId=${VERCEL_TEAM_ID}` : ""}&limit=1`, {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    });

    let status: VercelProjectMeta["status"] = "READY";
    let prodUrl = data.targets?.production?.url || data.link?.url || "";

    if (deployRes.ok) {
      const deployData = await deployRes.json();
      if (deployData.deployments?.[0]) {
        status = deployData.deployments[0].state;
        prodUrl = prodUrl || deployData.deployments[0].url;
      }
    }

    return {
      status,
      url: prodUrl.startsWith("http") ? prodUrl : `https://${prodUrl}`,
      updatedAt: data.updatedAt,
    };
  } catch (error) {
    console.error("Error fetching Vercel meta:", error);
    return null;
  }
}

export async function createVercelProject(name: string, githubRepo: string, framework: string = "nextjs"): Promise<{ id: string; url: string } | null> {
  const { VERCEL_TOKEN, VERCEL_TEAM_ID } = getTokens();
  if (!VERCEL_TOKEN) {
    console.error("VERCEL_TOKEN not configured");
    return null;
  }

  try {
    const [githubOwner, githubRepoName] = githubRepo.split("/");

    const url = VERCEL_TEAM_ID
      ? `https://api.vercel.com/v9/projects?teamId=${VERCEL_TEAM_ID}`
      : `https://api.vercel.com/v9/projects`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        framework,
        gitRepository: {
          type: "github",
          repo: githubRepo,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating Vercel project:", errorData);
      return null;
    }

    const data = await response.json();
    return {
      id: data.id,
      url: `https://${data.name}.vercel.app`,
    };
  } catch (error) {
    console.error("Exception creating Vercel project:", error);
    return null;
  }
}

export async function setVercelEnvVar(projectId: string, key: string, value: string): Promise<boolean> {
  const { VERCEL_TOKEN, VERCEL_TEAM_ID } = getTokens();
  if (!VERCEL_TOKEN) return false;

  try {
    const url = VERCEL_TEAM_ID
      ? `https://api.vercel.com/v10/projects/${projectId}/env?teamId=${VERCEL_TEAM_ID}`
      : `https://api.vercel.com/v10/projects/${projectId}/env`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
        value,
        type: "secret",
        target: ["production", "preview", "development"],
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Error setting Vercel env var:", error);
    return false;
  }
}

/**
 * Triggers a new deployment for a Vercel project.
 */
export async function triggerVercelDeployment(projectId: string): Promise<string | null> {
    const { VERCEL_TOKEN, VERCEL_TEAM_ID } = getTokens();
    if (!VERCEL_TOKEN) return null;
    try {
        const url = VERCEL_TEAM_ID
          ? `https://api.vercel.com/v13/deployments?teamId=${VERCEL_TEAM_ID}`
          : `https://api.vercel.com/v13/deployments`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${VERCEL_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: "manual-sync-deployment",
                projectId,
            }),
        });

        if (!response.ok) return null;
        const data = await response.json();
        return data.id;
    } catch (error) {
        return null;
    }
}
