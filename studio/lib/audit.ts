import { db } from "@maatwork/database";
import { audit_logs } from "@maatwork/database/schema";
import { v4 as uuid } from "uuid";
import { headers } from "next/headers";

interface AuditLogOptions {
  appId?: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

export async function logAuditEvent({
  appId,
  userId,
  action,
  entityType,
  entityId,
  metadata
}: AuditLogOptions) {
  try {
    const headersList = await headers();
    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || null;
    const userAgent = headersList.get("user-agent") || null;

    await db.insert(audit_logs).values({
      id: uuid(),
      appId,
      userId,
      action,
      entityType,
      entityId,
      metadata,
      ipAddress,
      userAgent,
      createdAt: new Date(),
    });
  } catch (error) {
    // We don't want audit logging failures to crash the main user action,
    // so we log the error but don't rethrow. In production, this would
    // go to a separate dead-letter queue or monitoring system.
    console.error("Failed to write audit log:", error);
  }
}
