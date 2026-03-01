import { requireFounder } from "@maatwork/auth/middleware";
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  return await requireFounder(req as any);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
