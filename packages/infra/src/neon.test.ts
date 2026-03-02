import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createNeonProject } from './neon';

global.fetch = vi.fn();

describe('neon infra', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEON_API_KEY = 'mock-key';
  });

  it('creates neon project correctly', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        project: {
          id: 'neon-prj-123',
          name: 'maat-test'
        },
        connection_uris: [{ connection_uri: 'postgresql://...' }]
      })
    });

    const project = await createNeonProject('maat-test');
    expect(project).toEqual({
      id: 'neon-prj-123',
      name: 'maat-test',
      connection_uri: 'postgresql://...'
    });
  });

  it('returns null on neon error', async () => {
    (fetch as any).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: 'Error' })
    });
    const project = await createNeonProject('maat-test');
    expect(project).toBeNull();
  });
});
