import { describe, it, expect, vi, beforeEach } from 'vitest';
import { trackEvent, trackFinancialEvent } from './analytics';
import { db } from '@maatwork/database';
import { analytics_events } from '@maatwork/database/schema';

// Mock the dependencies
vi.mock('@maatwork/database', () => {
  const valuesMock = vi.fn().mockResolvedValue([]);
  return {
    db: {
      insert: vi.fn().mockReturnValue({
        values: valuesMock
      })
    }
  };
});

vi.mock('@maatwork/database/schema', () => {
  return {
    analytics_events: {
      name: 'analytics_events'
    }
  };
});

vi.mock('uuid', () => ({
  v4: vi.fn().mockReturnValue('mock-uuid-1234')
}));

describe('analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('trackEvent', () => {
    it('should insert an event into the database with provided values', async () => {
      await trackEvent({
        appId: 'app-1',
        eventType: 'feature.used',
        source: 'studio',
        value: 100,
        metadata: { key: 'value' }
      });

      expect(db.insert).toHaveBeenCalledWith(analytics_events);

      const insertMock = vi.mocked(db.insert);
      const valuesMock = insertMock.mock.results[0].value.values;

      expect(valuesMock).toHaveBeenCalledWith(expect.objectContaining({
        id: 'mock-uuid-1234',
        appId: 'app-1',
        eventType: 'feature.used',
        source: 'studio',
        value: '100',
        metadata: { key: 'value' },
        createdAt: expect.any(Date)
      }));
    });

    it('should handle missing optional fields gracefully', async () => {
      await trackEvent({
        eventType: 'system.ping',
        source: 'system'
      });

      const insertMock = vi.mocked(db.insert);
      const valuesMock = insertMock.mock.results[0].value.values;

      expect(valuesMock).toHaveBeenCalledWith(expect.objectContaining({
        id: 'mock-uuid-1234',
        appId: undefined,
        eventType: 'system.ping',
        source: 'system',
        value: undefined,
        metadata: undefined,
        createdAt: expect.any(Date)
      }));
    });

    it('should catch errors and log them without throwing', async () => {
      const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

      const valuesMock = vi.fn().mockRejectedValue(new Error('DB Error'));
      vi.mocked(db.insert).mockReturnValueOnce({ values: valuesMock } as any);

      await trackEvent({
        eventType: 'error.test',
        source: 'studio'
      });

      expect(consoleErrorMock).toHaveBeenCalledWith(
        '[Analytics] Failed to track error.test:',
        expect.any(Error)
      );

      consoleErrorMock.mockRestore();
    });
  });

  describe('trackFinancialEvent', () => {
    it('should track a financial event correctly with appId', async () => {
      await trackFinancialEvent(50, 'subscription', 'app-2');

      const insertMock = vi.mocked(db.insert);
      const valuesMock = insertMock.mock.results[0].value.values;

      expect(valuesMock).toHaveBeenCalledWith(expect.objectContaining({
        id: 'mock-uuid-1234',
        appId: 'app-2',
        eventType: 'mrr.update',
        source: 'system',
        value: '50',
        metadata: { type: 'subscription' },
        createdAt: expect.any(Date)
      }));
    });

    it('should track a financial event correctly without appId', async () => {
      await trackFinancialEvent(100, 'one-time');

      const insertMock = vi.mocked(db.insert);
      const valuesMock = insertMock.mock.results[0].value.values;

      expect(valuesMock).toHaveBeenCalledWith(expect.objectContaining({
        id: 'mock-uuid-1234',
        appId: undefined,
        eventType: 'mrr.update',
        source: 'system',
        value: '100',
        metadata: { type: 'one-time' },
        createdAt: expect.any(Date)
      }));
    });
  });
});
