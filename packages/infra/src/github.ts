export interface GitHubRepoMeta {
  stars: number;
  forks: number;
  lastCommit: string;
  url: string;
  lastCommitSha?: string;
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function getGitHubRepoMeta(repo: string): Promise<GitHubRepoMeta | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
        "Accept": "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) return null;

    const data = await res.json();

    // Also get the latest commit SHA
    const commitsRes = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=1`, {
        headers: {
          ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
          "Accept": "application/vnd.github.v3+json",
        },
    });
    let lastCommitSha = undefined;
    if (commitsRes.ok) {
        const commits = await commitsRes.json();
        lastCommitSha = commits[0]?.sha;
    }

    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      lastCommit: data.pushed_at,
      url: data.html_url,
      lastCommitSha,
    };
  } catch (error) {
    console.error("Error fetching GitHub meta:", error);
    return null;
  }
}

export async function createRepoFromTemplate(templateRepo: string, newRepoName: string): Promise<string | null> {
  if (!GITHUB_TOKEN) {
    console.error("GITHUB_TOKEN not configured");
    return null;
  }

  try {
    const [owner, repo] = templateRepo.split("/");
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newRepoName,
        private: true,
        include_all_branches: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error generating repo from template:", errorData);
      return null;
    }

    const data = await response.json();
    return data.full_name; // e.g., "giolivo/new-repo"
  } catch (error) {
    console.error("Exception generating repo from template:", error);
    return null;
  }
}

export async function getAuthenticatedUser(): Promise<string | null> {
    if (!GITHUB_TOKEN) return null;
    try {
        const response = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json",
            }
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data.login;
    } catch (error) {
        return null;
    }
}

/**
 * Creates a Pull Request from a source branch to a target branch.
 * Useful for template synchronization.
 */
export async function createPullRequest(repo: string, title: string, head: string, base: string = "main", body: string = ""): Promise<string | null> {
    if (!GITHUB_TOKEN) return null;
    try {
        const response = await fetch(`https://api.github.com/repos/${repo}/pulls`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                head,
                base,
                body,
            }),
        });
        if (!response.ok) {
            const err = await response.json();
            console.error("PR creation error:", err);
            return null;
        }
        const data = await response.json();
        return data.html_url;
    } catch (error) {
        console.error("PR Exception:", error);
        return null;
    }
}

/**
 * Compares two commits to see if a repo is out of date with its template.
 */
export async function compareCommits(repo: string, base: string, head: string): Promise<{ status: 'ahead' | 'behind' | 'identical' | 'diverged', ahead_by: number, behind_by: number } | null> {
    if (!GITHUB_TOKEN) return null;
    try {
        const response = await fetch(`https://api.github.com/repos/${repo}/compare/${base}...${head}`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json",
            }
        });
        if (!response.ok) return null;
        const data = await response.json();
        return {
            status: data.status,
            ahead_by: data.ahead_by,
            behind_by: data.behind_by,
        };
    } catch (error) {
        return null;
    }
}
