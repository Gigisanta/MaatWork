import { getGitHubRepoMeta } from "./lib/github";
import { getVercelProjectMeta } from "./lib/vercel";
import * as dotenv from "dotenv";
import path from "path";

// Load from root .env
dotenv.config({ path: path.join(process.cwd(), "../../.env") });

async function verify() {
  console.log("--- Integrated Connectivity Proof ---");
  console.log("Checking GitHub Token...");
  const gh = await getGitHubRepoMeta("facebook/react"); // Test with a public repo
  if (gh) console.log("✅ GitHub Connection: OK (Total Stars:", gh.stars, ")");
  else console.log("❌ GitHub Connection: FAILED");

  console.log("Checking Vercel Token...");
  // We need a Project ID to test Vercel properly, but a null check is a start
  if (process.env.VERCEL_TOKEN) console.log("✅ Vercel Token: PRESENT");
  else console.log("❌ Vercel Token: MISSING");
}

verify();
