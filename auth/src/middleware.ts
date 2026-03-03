import { auth } from "./index";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function requireFounder(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'founder') {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

export async function requireAppAccess(req: NextRequest, appSlug: string) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  if (session.user.role === 'founder') {
    return NextResponse.next(); // Founders can access any app
  }
  
  // Future lookup logic to match appSlug to appId
  // For now, allow if appId exists on user
  if (!session.user.appId) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
  
  return NextResponse.next();
}
