export interface NeonProject {
  id: string;
  name: string;
  connection_uri: string;
}

export async function createNeonProject(name: string): Promise<NeonProject | null> {
  const apiKey = process.env.NEON_API_KEY;
  if (!apiKey) {
    console.error("NEON_API_KEY is not configured");
    return null;
  }

  try {
    const response = await fetch("https://console.neon.tech/api/v2/projects", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        project: {
          name,
          region_id: "aws-us-east-2", // Default region
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating Neon project:", errorData);
      return null;
    }

    const data = await response.json();

    // Get the connection URI for the first database/endpoint
    const connectionUri = data.connection_uris?.[0]?.connection_uri || "";

    return {
      id: data.project.id,
      name: data.project.name,
      connection_uri: connectionUri,
    };
  } catch (error) {
    console.error("Exception creating Neon project:", error);
    return null;
  }
}

export async function deleteNeonProject(projectId: string): Promise<boolean> {
  const apiKey = process.env.NEON_API_KEY;
  if (!apiKey) return false;

  try {
    const response = await fetch(`https://console.neon.tech/api/v2/projects/${projectId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Error deleting Neon project:", error);
    return false;
  }
}
