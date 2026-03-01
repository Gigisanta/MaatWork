import { pgTable, text, timestamp, boolean, jsonb, decimal } from 'drizzle-orm/pg-core';

export const tenants = pgTable('tenants', {
  id: text('id').primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  domain: text("domain").unique(), // Custom domain (optional)
  template: text("template", { enum: ["base", "natatorio", "peluqueria"] }).notNull().default("base"),
  config: jsonb('config'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  email: text('email').unique().notNull(),
  name: text('name'),
  role: text('role').$type<'founder' | 'admin' | 'employee'>().notNull().default('employee'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const clients = pgTable('clients', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  name: text('name').notNull(),
  phone: text('phone'),
  email: text('email'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const groups = pgTable('groups', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  name: text('name').notNull(),
  schedule: text('schedule'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  clientId: text('client_id').notNull().references(() => clients.id),
  groupId: text('group_id').references(() => groups.id),
  plan: text('plan'),
  status: text('status').$type<'active' | 'inactive'>().default('active'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const attendances = pgTable('attendances', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  clientId: text('client_id').notNull().references(() => clients.id),
  date: timestamp('date').defaultNow(),
});

export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  clientId: text('client_id').notNull().references(() => clients.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').$type<'paid' | 'pending' | 'cancelled'>().default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const time_entries = pgTable('time_entries', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  userId: text('user_id').notNull().references(() => users.id),
  clockIn: timestamp('clock_in').defaultNow(),
  clockOut: timestamp('clock_out'),
});

export const whatsapp_messages = pgTable('whatsapp_messages', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  clientId: text('client_id').notNull().references(() => clients.id),
  message: text('message').notNull(),
  status: text('status').$type<'sent' | 'delivered' | 'read' | 'failed'>().default('sent'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const pricing_plans = pgTable('pricing_plans', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  name: text('name').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  features: jsonb('features'),
});

export const settings = pgTable('settings', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  key: text('key').notNull(),
  value: jsonb('value').notNull(),
});

export const activity_logs = pgTable('activity_logs', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  userId: text('user_id').notNull().references(() => users.id),
  action: text('action').notNull(),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  body: text('body').notNull(),
  read: boolean('read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});
