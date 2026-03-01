import { createSafeActionClient } from "next-safe-action";
import { auth } from "./index";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof Error) {
      return e.message;
    }
    return "An unexpected error occurred.";
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return next({ ctx: { session } });
});

export const founderActionClient = actionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session?.user || session.user.role !== "founder") {
    throw new Error("Unauthorized function access");
  }

  return next({ ctx: { session } });
});

export const tenantActionClient = actionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session?.user || !session.user.tenantId) {
    throw new Error("Unauthorized tenant access");
  }

  return next({ ctx: { session } });
});
