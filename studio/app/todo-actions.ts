"use server";

import { db, studio_todos } from "@maatwork/database";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export async function getTodos() {
  return await db.select().from(studio_todos).orderBy(studio_todos.createdAt);
}

export async function addTodo(text: string, priority: 'low' | 'medium' | 'high' = 'medium') {
  await db.insert(studio_todos).values({
    id: uuidv4(),
    text,
    priority,
    completed: false,
  });
  revalidatePath("/");
}

export async function toggleTodo(id: string, completed: boolean) {
  await db.update(studio_todos)
    .set({ completed })
    .where(eq(studio_todos.id, id));
  revalidatePath("/");
}

export async function deleteTodo(id: string) {
  await db.delete(studio_todos).where(eq(studio_todos.id, id));
  revalidatePath("/");
}
