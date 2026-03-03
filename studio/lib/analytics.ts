import { db } from "@maatwork/database";
import { analytics_events } from "@maatwork/database/schema";
import { v4 as uuid } from "uuid";

interface TrackOptions {
  appId?: string;
  eventType: string; // e.g., 'mrr.update', 'feature.used'
  source: 'studio' | 'app-app' | 'system';
  value?: number;
  metadata?: Record<string, unknown>;
}

/**
 * MaatAnalytics Engine - Proprietary tracking internal tool.
 * High-performance event ingestion for founder intelligence.
 */
export async function trackEvent({
  appId,
  eventType,
  source,
  value,
  metadata
}: TrackOptions) {
  try {
    // In a production scaling scenario, this would go to a queue (e.g. SQS/Redis)
    await db.insert(analytics_events).values({
      id: uuid(),
      appId,
      eventType,
      source,
      value: value?.toString(),
      metadata,
      createdAt: new Date(),
    });
  } catch (error) {
    // Graceful failure for analytics to ensure main flow continuity
    console.error(`[Analytics] Failed to track ${eventType}:`, error);
  }
}

/**
 * Specialized helper for financial tracking
 */
export async function trackFinancialEvent(
  amount: number, 
  type: 'subscription' | 'one-time',
  appId?: string
) {
  return trackEvent({
    appId,
    eventType: 'mrr.update',
    source: 'system',
    value: amount,
    metadata: { type }
  });
}
