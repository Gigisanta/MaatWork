"use server";

import { db } from "@maatwork/database";
import { leads } from "@maatwork/database/schema";
import { founderActionClient } from "@maatwork/auth/safe-action";
import { z } from "zod";
import { activity_logs } from "@maatwork/database/schema";
import { v4 as uuid } from "uuid";
import { logAuditEvent } from "../../lib/audit";


function sanitizeCsvField(field: string | number | null | undefined): string {
  if (field === null || field === undefined || field === "") return "";
  let str = String(field);

  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }

  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export const exportLeadsAction = founderActionClient
  .schema(z.object({ format: z.enum(["csv", "json"]) }))
  .action(async ({ parsedInput: { format } }) => {
    const allLeads = await db.select().from(leads);
    
    if (format === "csv") {
      const headers = ["ID", "Name", "Email", "Company", "Status", "Value", "Created At"];
      const rows = allLeads.map(l => [
        sanitizeCsvField(l.id),
        sanitizeCsvField(l.name),
        sanitizeCsvField(l.email),
        sanitizeCsvField(l.company),
        sanitizeCsvField(l.status),
        sanitizeCsvField(l.value || "0"),
        sanitizeCsvField(l.createdAt?.toISOString())
      ].join(","));
      
      const csvContent = [headers.join(","), ...rows].join("\n");
      
      // Audit Vault Integration: Proprietary Immutable Audit Log
      await logAuditEvent({
        action: "leads.exported",
        entityType: "leads",
        metadata: { format, count: allLeads.length }
      });

      return { data: csvContent, fileName: `maatwork_leads_${new Date().getTime()}.csv` };
    }

    // Audit Vault Integration: Proprietary Immutable Audit Log
    await logAuditEvent({
      action: "leads.exported",
      entityType: "leads",
      metadata: { format, count: allLeads.length }
    });

    return { data: JSON.stringify(allLeads, null, 2), fileName: `maatwork_leads_${new Date().getTime()}.json` };
  });
