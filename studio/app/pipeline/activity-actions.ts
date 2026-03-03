"use server";

import { db } from "@maatwork/database";
import { lead_activities } from "@maatwork/database/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getLeadActivities(leadId: string) {
  return await db.query.lead_activities.findMany({
    where: eq(lead_activities.leadId, leadId),
    orderBy: [desc(lead_activities.createdAt)],
  });
}
