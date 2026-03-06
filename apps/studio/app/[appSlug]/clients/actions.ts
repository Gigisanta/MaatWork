"use server";

import { z } from "zod";
import { appActionClient, ActionError } from "@maatwork/auth/safe-action";
import { db } from "@maatwork/database";
import { clients } from "@maatwork/database/schema";
import { revalidatePath } from "next/cache";

export const createClientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z
    .string()
    .min(5, "Phone number too short")
    .optional()
    .or(z.literal("")),
  appId: z.string().uuid("Invalid app context"),
});

export const createClientAction = appActionClient
  .schema(createClientSchema)
  .action(
    async ({
      parsedInput: { name, email, phone, appId },
      ctx: { session },
    }) => {
      // 1. Security Check: Ensure user belongs to this app
      // (Note: middleware and Action Client already handle basic session, but we double-verify context)
      if (session.user.appId !== appId && session.user.role !== "founder") {
        return {
          success: false,
          error:
            "Security Violation: Unauthorized app context mutation attempted.",
        };
      }

      try {
        const [newClient] = await db
          .insert(clients)
          .values({
            id: crypto.randomUUID(),
            name,
            email: email || null,
            phone: phone || null,
            appId,
          })
          .returning();

        revalidatePath(`/${session.user.appId}/clients`);

        return { success: true, client: newClient };
      } catch (error) {
        console.error("Failed to create client:", error);
        return {
          success: false,
          error: "Database error occurred while creating client.",
        };
      }
    },
  );
