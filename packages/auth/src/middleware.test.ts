import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requireFounder, requireAppAccess } from './middleware';
import { auth } from './index';
import { NextResponse, NextRequest } from 'next/server';

vi.mock('./index', () => ({
  auth: vi.fn(),
}));

vi.mock('next/server', () => {
  return {
    NextResponse: {
      redirect: vi.fn((url: string | URL) => ({ type: 'redirect', url: url.toString() })),
      next: vi.fn(() => ({ type: 'next' })),
    },
  };
});

describe('middleware', () => {
  const mockRequest = { url: 'http://localhost/test' } as NextRequest;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('requireFounder', () => {
    it('should redirect to /login if no session exists', async () => {
      vi.mocked(auth).mockResolvedValueOnce(null);

      const result = await requireFounder(mockRequest);

      expect(auth).toHaveBeenCalledTimes(1);
      expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/login', mockRequest.url));
      expect(result).toEqual({ type: 'redirect', url: 'http://localhost/login' });
    });

    it('should redirect to /login if user is not a founder', async () => {
      vi.mocked(auth).mockResolvedValueOnce({
        user: { id: 'user-1', email: 'test@example.com', role: 'user', appId: 'app-1' },
        expires: '1000',
      });

      const result = await requireFounder(mockRequest);

      expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/login', mockRequest.url));
      expect(result).toEqual({ type: 'redirect', url: 'http://localhost/login' });
    });

    it('should call next if user is a founder', async () => {
      vi.mocked(auth).mockResolvedValueOnce({
        user: { id: 'founder-1', email: 'founder@example.com', role: 'founder', appId: 'app-1' },
        expires: '1000',
      });

      const result = await requireFounder(mockRequest);

      expect(NextResponse.next).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ type: 'next' });
    });
  });

  describe('requireAppAccess', () => {
    it('should redirect to /login if no session exists', async () => {
      vi.mocked(auth).mockResolvedValueOnce(null);

      const result = await requireAppAccess(mockRequest, 'some-app-slug');

      expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/login', mockRequest.url));
      expect(result).toEqual({ type: 'redirect', url: 'http://localhost/login' });
    });

    it('should call next if user is a founder', async () => {
      vi.mocked(auth).mockResolvedValueOnce({
        user: { id: 'founder-1', email: 'founder@example.com', role: 'founder', appId: 'app-1' },
        expires: '1000',
      });

      const result = await requireAppAccess(mockRequest, 'some-app-slug');

      expect(NextResponse.next).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ type: 'next' });
    });

    it('should redirect to /unauthorized if user has no appId', async () => {
      vi.mocked(auth).mockResolvedValueOnce({
        user: { id: 'user-1', email: 'test@example.com', role: 'user', appId: '' },
        expires: '1000',
      });

      const result = await requireAppAccess(mockRequest, 'some-app-slug');

      expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/unauthorized', mockRequest.url));
      expect(result).toEqual({ type: 'redirect', url: 'http://localhost/unauthorized' });
    });

    it('should call next if user is not founder but has an appId', async () => {
      vi.mocked(auth).mockResolvedValueOnce({
        user: { id: 'user-1', email: 'test@example.com', role: 'user', appId: 'some-app' },
        expires: '1000',
      });

      const result = await requireAppAccess(mockRequest, 'some-app-slug');

      expect(NextResponse.next).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ type: 'next' });
    });
  });
});
