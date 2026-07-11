import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, isAdminSessionToken } from './lib/adminSession';

const PUBLIC_PATHS = ['/login', '/register'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const hasAdminSession = isAdminSessionToken(token);

    if (hasAdminSession && PUBLIC_PATHS.includes(pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!hasAdminSession && !PUBLIC_PATHS.includes(pathname)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
};
