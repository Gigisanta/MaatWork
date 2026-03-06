import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logAuditEvent } from '../audit';
import { db } from '@maatwork/database';
import { headers } from 'next/headers';
import { v4 as uuid } from 'uuid';

// Mock dependencies
vi.mock('@maatwork/database', () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(),
    })),
  },
}));

vi.mock('@maatwork/database/schema', () => ({
  audit_logs: {},
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'test-uuid-1234'),
}));

// Mock console.error
const originalConsoleError = console.error;
beforeEach(() => {
  vi.clearAllMocks();
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
});

describe('logAuditEvent', () => {
  it('should successfully log an audit event with headers', async () => {
    const mockInsertValues = vi.fn();
    (db.insert as any).mockReturnValue({ values: mockInsertValues });

    const mockHeaders = new Map([
      ['x-forwarded-for', '192.168.1.1, 10.0.0.1'],
      ['user-agent', 'test-agent'],
    ]);
    (headers as any).mockResolvedValue({
      get: (key: string) => mockHeaders.get(key) || null,
    });

    const options = {
      appId: 'app-1',
      userId: 'user-1',
      action: 'create',
      entityType: 'post',
      entityId: 'post-1',
      metadata: { key: 'value' },
    };

    await logAuditEvent(options);

    expect(db.insert).toHaveBeenCalled();
    expect(mockInsertValues).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'test-uuid-1234',
        appId: 'app-1',
        userId: 'user-1',
        action: 'create',
        entityType: 'post',
        entityId: 'post-1',
        metadata: { key: 'value' },
        ipAddress: '192.168.1.1',
        userAgent: 'test-agent',
        createdAt: expect.any(Date),
      })
    );
  });

  it('should handle missing headers gracefully', async () => {
    const mockInsertValues = vi.fn();
    (db.insert as any).mockReturnValue({ values: mockInsertValues });

    (headers as any).mockResolvedValue({
      get: () => null,
    });

    const options = {
      action: 'delete',
      entityType: 'comment',
    };

    await logAuditEvent(options);

    expect(db.insert).toHaveBeenCalled();
    expect(mockInsertValues).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'delete',
        entityType: 'comment',
        ipAddress: null,
        userAgent: null,
      })
    );
  });

  it('should catch and log errors without crashing', async () => {
    const testError = new Error('DB Connection Failed');
    (db.insert as any).mockImplementation(() => {
      throw testError;
    });

    (headers as any).mockResolvedValue({
      get: () => null,
    });

    const options = {
      action: 'update',
      entityType: 'user',
    };

    // Should not throw
    await expect(logAuditEvent(options)).resolves.not.toThrow();

    expect(console.error).toHaveBeenCalledWith('Failed to write audit log:', testError);
  });
});
