'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthService } from '../api/auth';

export async function login(email: string, password: string): Promise<{ error: string } | void> {
    try {
        const authService = new AuthService();
        const { setCookies } = await authService.login(email, password);
        const cookieStore = await cookies();
        for (const raw of setCookies) {
            const parts = raw.split(';').map(p => p.trim());
            const eqIdx = parts[0].indexOf('=');
            const name = parts[0].slice(0, eqIdx).trim();
            const value = parts[0].slice(eqIdx + 1);
            const opts: Parameters<typeof cookieStore.set>[2] = { path: '/' };
            for (const attr of parts.slice(1)) {
                const [k, v] = attr.split('=');
                const key = k.trim().toLowerCase();
                if (key === 'httponly') opts.httpOnly = true;
                if (key === 'secure') opts.secure = true;
                if (key === 'samesite') opts.sameSite = v?.trim().toLowerCase() as 'strict' | 'lax' | 'none';
                if (key === 'max-age') opts.maxAge = parseInt(v, 10);
                if (key === 'path') opts.path = v?.trim();
            }
            if (name) cookieStore.set(name, value, opts);
        }
    } catch {
        return { error: 'Invalid email or password' };
    }
    redirect('/');
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    redirect('/login');
}
