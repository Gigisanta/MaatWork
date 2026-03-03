"use server";

import { db } from "@maatwork/database";
import { apps, clients, leads } from "@maatwork/database/schema";
import { ilike, or } from "drizzle-orm";

export async function globalSearchAction(query: string) {
    if (!query || query.length < 2) return { apps: [], clients: [], leads: [] };

    const [foundApps, foundClients, foundLeads] = await Promise.all([
        db.select().from(apps).where(or(ilike(apps.name, `%${query}%`), ilike(apps.slug, `%${query}%`))).limit(5),
        db.select().from(clients).where(or(ilike(clients.name, `%${query}%`), ilike(clients.email, `%${query}%`))).limit(5),
        db.select().from(leads).where(or(ilike(leads.name, `%${query}%`), ilike(leads.company, `%${query}%`))).limit(5)
    ]);

    return {
        apps: foundApps,
        clients: foundClients,
        leads: foundLeads
    };
}
