import { decodeJwt } from 'jose';

export const ADMIN_SESSION_COOKIE = 'admin_jwt';

type AdminJwtPayload = {
  role?: unknown;
  exp?: number;
};

export function isAdminSessionToken(token: string | undefined): boolean {
  if (!token) {
    return false;
  }

  try {
    const payload = decodeJwt(token) as AdminJwtPayload;
    const role = typeof payload.role === 'string' ? payload.role.toLowerCase() : '';

    return role === 'admin' && (payload.exp === undefined || payload.exp * 1000 > Date.now());
  } catch {
    return false;
  }
}
