"use server";

import { db } from "@maatwork/database";
import { leads } from "@maatwork/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { lead_activities } from "@maatwork/database/schema";
import { desc } from "drizzle-orm";

export async function updateLeadStatus(id: string, status: "new" | "contacted" | "proposal" | "won" | "lost") {
  try {
    await db.update(leads)
      .set({ status, updatedAt: new Date() })
      .where(eq(leads.id, id));
    
    // Log system activity
    await addLeadActivity(id, {
      type: "system",
      content: `Estado actualizado a: ${status}`,
    });

    revalidatePath("/pipeline");
    return { success: true };
  } catch (error) {
    console.error("Failed to update lead status:", error);
    return { success: false, error: "Failed to update lead status" };
  }
}

export async function getLeads() {
  return await db.query.leads.findMany({
    with: {
      activities: {
        limit: 1,
        orderBy: [desc(lead_activities.createdAt)]
      }
    }
  });
}

export async function getLeadById(id: string) {
  return await db.query.leads.findFirst({
    where: eq(leads.id, id),
    with: {
      activities: {
        orderBy: [desc(lead_activities.createdAt)]
      }
    }
  });
}

export async function updateLead(id: string, data: Partial<typeof leads.$inferInsert>) {
  try {
    await db.update(leads)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(leads.id, id));
    
    revalidatePath("/pipeline");
    return { success: true };
  } catch (error) {
    console.error("Failed to update lead:", error);
    return { success: false, error: "Failed to update lead" };
  }
}

export async function addLeadActivity(leadId: string, data: { type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'system'; content: string; metadata?: any }) {
  try {
    const id = Math.random().toString(36).substring(7);
    await db.insert(lead_activities).values({
      id,
      leadId,
      ...data,
    });
    
    revalidatePath("/pipeline");
    return { success: true };
  } catch (error) {
    console.error("Failed to add lead activity:", error);
    return { success: false, error: "Failed to add lead activity" };
  }
}
