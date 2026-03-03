import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createVercelProject, setVercelEnvVar } from './vercel';

global.fetch = vi.fn();

describe('vercel infra', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.VERCEL_TOKEN = 'mock-token';
  });

  it('creates vercel project correctly', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        id: 'prj_123',
        name: 'test-project'
      })
    });

    const project = await createVercelProject('test-project', 'test/repo');
    expect(project).toEqual({
      id: 'prj_123',
      url: 'https://test-project.vercel.app'
    });
  });

  it('sets env var correctly', async () => {
    (fetch as any).mockResolvedValueOnce({ ok: true });
    const success = await setVercelEnvVar('prj_123', 'KEY', 'VALUE');
    expect(success).toBe(true);
  });
});
