import { createSafeActionClient } from "next-safe-action";
import { auth } from "./index";

export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof ActionError) {
      return e.message;
    }
    return "An unexpected error occurred.";
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session?.user) {
    throw new ActionError("Unauthorized");
  }

  return next({ ctx: { session } });
});

export const founderActionClient = actionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session?.user || session.user.role !== "founder") {
    throw new ActionError("Unauthorized function access");
  }

  return next({ ctx: { session } });
});

export const appActionClient = actionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session?.user || !session.user.appId) {
    throw new ActionError("Unauthorized app access");
  }

  return next({ ctx: { session } });
});
