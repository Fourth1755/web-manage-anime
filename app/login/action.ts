'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthService } from '../api/auth';

export async function login(email: string, password: string): Promise<{ error: string } | void> {
    try {
        const authService = new AuthService();
        const result = await authService.login(email, password);
        const cookieStore = await cookies();
        cookieStore.set('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24,
            path: '/',
        });
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
