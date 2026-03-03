"use server";

import { db } from "@maatwork/database";
import { templates } from "@maatwork/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const templateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  githubRepo: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
});

export async function getTemplates() {
  return await db.select().from(templates);
}

export async function createTemplate(data: z.infer<typeof templateSchema>) {
  try {
    await db.insert(templates).values(data);
    revalidatePath("/templates");
    return { success: true };
  } catch (error) {
    console.error("Failed to create template:", error);
    return { success: false, error: "Failed to create template" };
  }
}

export async function deleteTemplate(id: string) {
  try {
    await db.delete(templates).where(eq(templates.id, id));
    revalidatePath("/templates");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
