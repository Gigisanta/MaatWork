import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requireFounder, requireAppAccess } from '../middleware';
import { NextResponse, NextRequest } from 'next/server';

// Mock the auth index module
vi.mock('../index', () => ({
  auth: vi.fn(),
}));

// Mock next/server
vi.mock('next/server', () => {
  return {
    NextResponse: {
      next: vi.fn(() => 'next_response'),
      redirect: vi.fn((url) => ({ type: 'redirect', url: url.toString() })),
    },
  };
});

import { auth } from '../index';

describe('auth middleware', () => {
  let mockRequest: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRequest = {
      url: 'http://localhost:3000/protected-route',
    } as unknown as NextRequest;
  });

  describe('requireFounder', () => {
    it('should redirect to /login if no session exists', async () => {
      vi.mocked(auth).mockResolvedValueOnce(null);

      const result = await requireFounder(mockRequest);

      expect(auth).toHaveBeenCalled();
      expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/login', mockRequest.url));
      expect(result).toEqual({ type: 'redirect', url: 'http://localhost:3000/login' });
    });

    it('should redirect to /login if user is not a founder', async () => {
      vi.mocked(auth).mockResolvedValueOnce({
        user: { role: 'user', id: '1' },
        expires: '2030-01-01T00:00:00.000Z'
      });

      const result = await requireFounder(mockRequest);

      expect(auth).toHaveBeenCalled();
      expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/login', mockRequest.url));
      expect(result).toEqual({ type: 'redirect', url: 'http://localhost:3000/login' });
    });

    it('should call NextResponse.next() if user is a founder', async () => {
      vi.mocked(auth).mockResolvedValueOnce({
        user: { role: 'founder', id: '1' },
        expires: '2030-01-01T00:00:00.000Z'
      });

      const result = await requireFounder(mockRequest);

      expect(auth).toHaveBeenCalled();
      expect(NextResponse.next).toHaveBeenCalled();
      expect(result).toBe('next_response');
    });
  });

  describe('requireAppAccess', () => {
    it('should redirect to /login if no session exists', async () => {
      vi.mocked(auth).mockResolvedValueOnce(null);

      const result = await requireAppAccess(mockRequest, 'test-app');

      expect(auth).toHaveBeenCalled();
      expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/login', mockRequest.url));
      expect(result).toEqual({ type: 'redirect', url: 'http://localhost:3000/login' });
    });

    it('should call NextResponse.next() if user is a founder', async () => {
      vi.mocked(auth).mockResolvedValueOnce({
        user: { role: 'founder', id: '1' },
        expires: '2030-01-01T00:00:00.000Z'
      });

      const result = await requireAppAccess(mockRequest, 'test-app');

      expect(auth).toHaveBeenCalled();
      expect(NextResponse.next).toHaveBeenCalled();
      expect(result).toBe('next_response');
    });

    it('should redirect to /unauthorized if user has no appId', async () => {
      vi.mocked(auth).mockResolvedValueOnce({
        user: { role: 'user', id: '1' },
        expires: '2030-01-01T00:00:00.000Z'
      });

      const result = await requireAppAccess(mockRequest, 'test-app');

      expect(auth).toHaveBeenCalled();
      expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/unauthorized', mockRequest.url));
      expect(result).toEqual({ type: 'redirect', url: 'http://localhost:3000/unauthorized' });
    });

    it('should call NextResponse.next() if user is not founder but has an appId', async () => {
      vi.mocked(auth).mockResolvedValueOnce({
        user: { role: 'user', id: '1', appId: 'app-123' },
        expires: '2030-01-01T00:00:00.000Z'
      });

      const result = await requireAppAccess(mockRequest, 'test-app');

      expect(auth).toHaveBeenCalled();
      expect(NextResponse.next).toHaveBeenCalled();
      expect(result).toBe('next_response');
    });
  });
});
