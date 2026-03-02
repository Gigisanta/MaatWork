import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGitHubRepoMeta, createRepoFromTemplate } from './github';

global.fetch = vi.fn();

describe('github infra', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches repo meta correctly', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        stargazers_count: 10,
        forks_count: 5,
        pushed_at: '2023-01-01',
        html_url: 'https://github.com/test/repo'
      })
    });

    (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ sha: 'mock-sha' }])
    });

    const meta = await getGitHubRepoMeta('test/repo');
    expect(meta).toEqual({
      stars: 10,
      forks: 5,
      lastCommit: '2023-01-01',
      url: 'https://github.com/test/repo',
      lastCommitSha: 'mock-sha'
    });
  });

  it('returns null on fetch error', async () => {
    (fetch as any).mockResolvedValueOnce({ ok: false });
    const meta = await getGitHubRepoMeta('test/repo');
    expect(meta).toBeNull();
  });
});
