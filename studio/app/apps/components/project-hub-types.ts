export interface ProjectHubProps {
  appId: string;
  githubRepo?: string | null;
  vercelProjectId?: string | null;
  vercelUrl?: string | null;
  neonUrl?: string | null;
  isInternal?: boolean | null;
}
