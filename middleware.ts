import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register'];

function findAuthToken(request: NextRequest): string | undefined {
    // Check all cookies for a JWT (any cookie whose value starts with eyJ)
    for (const cookie of request.cookies.getAll()) {
        if (cookie.value.startsWith('eyJ')) {
            return cookie.value;
        }
    }
    return undefined;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = findAuthToken(request);

    if (token && PUBLIC_PATHS.includes(pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!token && !PUBLIC_PATHS.includes(pathname)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
};
