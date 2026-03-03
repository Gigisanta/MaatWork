import { db } from './index';
import { apps, users } from './schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../../.env') });

async function main() {
  console.log('Seeding initial data...');
  
  // Create HQ App
  await db.insert(apps).values({
    id: 'maatwork-hq',
    slug: 'studio',
    name: 'Maatwork Studio',
    template: 'natatorio', // Template doesn't matter for HQ
    config: { theme: 'dark' }
  }).onConflictDoNothing();

  await db.insert(users).values({
    id: 'founder-1',
    appId: 'maatwork-hq',
    email: 'gio@maat.work',
    name: 'Gio',
    role: 'founder'
  }).onConflictDoNothing();

  await db.insert(users).values({
    id: 'founder-2',
    appId: 'maatwork-hq',
    email: 'tomi@maat.work',
    name: 'Tomi',
    role: 'founder'
  }).onConflictDoNothing();

  // Create Demo Apps
  await db.insert(apps).values({
    id: 'demo-natatorio',
    slug: 'natatorio',
    name: 'Natatorio Demo',
    template: 'natatorio',
    config: {}
  }).onConflictDoNothing();

  // Create Mock Invoices for the demo app
  const { app_invoices, leads, activity_logs } = await import('./schema');
  await db.insert(app_invoices).values([
    {
      id: 'inv_1',
      appId: 'demo-natatorio',
      amount: '35000.00',
      currency: 'ARS',
      status: 'paid',
    },
    {
      id: 'inv_2',
      appId: 'maatwork-hq',
      amount: '35000.00',
      currency: 'ARS',
      status: 'paid',
    }
  ]).onConflictDoNothing();

  // Insert Leads for the Pipeline
  await db.insert(leads).values([
    { id: "lead_1", name: "Gimnasio El Músculo", email: "contacto@elmusculo.com", company: "El Músculo Gym", status: "new", value: "150000.00", notes: "Interesado en gestión de socios y pagos." },
    { id: "lead_2", name: "Centro de Estética Zen", email: "info@esteticazen.ar", company: "Zen Beauty", status: "contacted", value: "85000.00", notes: "Llamado inicial realizado, agendada demo." },
    { id: "lead_3", name: "CrossFit Box Sur", email: "admin@crossfitsur.com", company: "CF Sur", status: "proposal", value: "200000.00", notes: "Propuesta enviada para 3 sucursales." },
    { id: "lead_4", name: "Yoga Flow Studio", email: "hola@yogaflow.com", company: "Yoga Flow", status: "won", value: "60000.00", notes: "Cierre exitoso v1.0." },
  ]).onConflictDoNothing();

  // Insert Activity Logs
  await db.insert(activity_logs).values([
    { id: "log_1", appId: "maatwork-hq", userId: "founder-1", action: "APP_CREATED", details: { appName: "Natatorio Splasher" }, createdAt: new Date(Date.now() - 15 * 60 * 1000) },
    { id: "log_2", appId: "maatwork-hq", userId: "founder-1", action: "SECURITY_UPDATE", details: { patch: "v1.0.1", appliedTo: "all" }, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: "log_3", appId: "demo-natatorio", userId: "founder-1", action: "PAYMENT_FAILED", details: { appName: "Peluquería Glam", error: "Insufficient funds" }, createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) },
    { id: "log_4", appId: "maatwork-hq", userId: "founder-2", action: "USER_REGISTERED", details: { userName: "Federico L.", role: "admin" }, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  ]).onConflictDoNothing();

  console.log('Seed completed successfully!');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
