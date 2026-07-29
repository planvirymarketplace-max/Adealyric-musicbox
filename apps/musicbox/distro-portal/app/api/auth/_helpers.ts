import { jwtVerify, SignJWT } from 'jose';
import { db } from '@/lib/db';
import type { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'adea-lyric-dev-secret-key-2024');
const JWT_ISSUER = 'adea-lyric-platform';
const JWT_AUDIENCE = 'adea-lyric-api';

export type AuthUser = {
  id: string;
  email: string;
  role: string;
  tenantId: string;
  displayName: string | null;
  orgName: string | null;
  status: string;
};

/** Generate a JWT token for a user session */
export async function generateToken(user: AuthUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime('24h')
    .setSubject(user.id)
    .sign(JWT_SECRET);
}

/** Verify a JWT token and return the payload */
export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    return payload as unknown as AuthUser;
  } catch {
    return null;
  }
}

/** Extract and verify user from request Authorization header or session cookie */
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const user = await verifyToken(token);
    if (user) return user;
  }
  const sessionCookie = request.cookies.get('session-token')?.value;
  if (sessionCookie) {
    const user = await verifyToken(sessionCookie);
    if (user) return user;
  }
  return null;
}

/** Require authentication — returns user or throws error response */
export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await getAuthUser(request);
  if (!user) throw new AuthError('Authentication required', 'UNAUTHORIZED', 401);
  if (user.status === 'suspended') throw new AuthError('Account suspended', 'ACCOUNT_SUSPENDED', 403);
  return user;
}

/** Require specific role(s) — admin always passes */
export async function requireRole(request: NextRequest, roles: string[]): Promise<AuthUser> {
  const user = await requireAuth(request);
  if (user.role === 'admin' || roles.includes(user.role)) return user;
  throw new AuthError(`Role '${user.role}' not permitted. Required: ${roles.join(',')}`, 'FORBIDDEN_ROLE', 403);
}

/** Custom auth error */
export class AuthError extends Error {
  code: string;
  statusCode: number;
  constructor(message: string, code: string, statusCode: number) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}
