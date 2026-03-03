"use server";

import { checkSystemHealth } from "@maatwork/infra";
import { revalidatePath } from "next/cache";

export async function getSystemHealth() {
  return await checkSystemHealth();
}

export async function refreshHealth() {
    revalidatePath("/health");
}
