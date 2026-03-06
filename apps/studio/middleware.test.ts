import { describe, it, expect, vi, beforeEach } from "vitest";
import { middleware } from "./middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireFounder } from "@maatwork/auth/middleware";

// Mock next/server
vi.mock("next/server", () => {
  return {
    NextResponse: {
      next: vi.fn(() => "NEXT_RESPONSE_NEXT"),
    },
  };
});

// Mock @maatwork/auth/middleware
vi.mock("@maatwork/auth/middleware", () => {
  return {
    requireFounder: vi.fn(() => "REQUIRE_FOUNDER_RESPONSE"),
  };
});

describe("middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createMockRequest(
    pathname: string,
    host: string = "localhost:3001",
  ): NextRequest {
    return {
      nextUrl: {
        pathname,
      },
      headers: {
        get: (key: string) => {
          if (key === "host") return host;
          return null;
        },
      },
    } as unknown as NextRequest;
  }

  describe("public routes", () => {
    const publicPaths = [
      "/login",
      "/api/auth/callback/github",
      "/_next/static/css/styles.css",
      "/favicon.ico",
    ];

    it.each(publicPaths)("should allow public route: %s", async (path) => {
      const req = createMockRequest(path);
      const res = await middleware(req);

      expect(res).toBe("NEXT_RESPONSE_NEXT");
      expect(NextResponse.next).toHaveBeenCalled();
      expect(requireFounder).not.toHaveBeenCalled();
    });
  });

  describe("dynamic app routes", () => {
    const appPaths = [
      "/my-app-id",
      "/another-app/dashboard",
      "/users/123/settings",
    ];

    it.each(appPaths)("should allow dynamic app route: %s", async (path) => {
      const req = createMockRequest(path);
      const res = await middleware(req);

      expect(res).toBe("NEXT_RESPONSE_NEXT");
      expect(NextResponse.next).toHaveBeenCalled();
      expect(requireFounder).not.toHaveBeenCalled();
    });
  });

  describe("studio routes", () => {
    const studioPaths = [
      "/apps",
      "/apps/new",
      "/analytics",
      "/audit",
      "/billing",
      "/clients",
      "/health",
      "/pipeline",
      "/templates",
    ];

    it.each(studioPaths)(
      "should require founder for studio route: %s",
      async (path) => {
        const req = createMockRequest(path);
        const res = await middleware(req);

        expect(res).toBe("REQUIRE_FOUNDER_RESPONSE");
        expect(requireFounder).toHaveBeenCalledWith(req);
        expect(NextResponse.next).not.toHaveBeenCalled();
      },
    );
  });

  describe("studio root routes", () => {
    const rootPaths = ["/"];

    it.each(rootPaths)(
      "should require founder for root route: %s",
      async (path) => {
        const req = createMockRequest(path);
        const res = await middleware(req);

        expect(res).toBe("REQUIRE_FOUNDER_RESPONSE");
        expect(requireFounder).toHaveBeenCalledWith(req);
        expect(NextResponse.next).not.toHaveBeenCalled();
      },
    );
  });
});
