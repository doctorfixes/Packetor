/**
 * Auth scaffolding (v1.0 placeholder).
 *
 * This module is intentionally minimal. Wire it into a real auth provider
 * (e.g. JWT, OAuth2, SAML) for production deployments.
 */

export interface AuthContext {
  userId: string;
  tenantId: string;
  roles: string[];
}

/**
 * Verify an incoming bearer token and return an AuthContext.
 * Currently returns a stub context – replace with real verification logic.
 */
export function verifyToken(token: string): AuthContext | null {
  // TODO: validate JWT / call identity provider
  if (!token || token === 'invalid') {
    return null;
  }
  return {
    userId: 'stub-user',
    tenantId: 'default',
    roles: ['user'],
  };
}

/**
 * Express-compatible middleware that checks for a bearer token.
 */
export function authMiddleware(
  req: { headers: Record<string, string | string[] | undefined> },
  res: { status: (code: number) => { json: (body: unknown) => void } },
  next: () => void
): void {
  const authHeader = req.headers['authorization'];
  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    res.status(401).json({ error: 'Unauthorized: missing token.' });
    return;
  }

  const ctx = verifyToken(token);
  if (!ctx) {
    res.status(403).json({ error: 'Forbidden: invalid token.' });
    return;
  }

  // Attach context to request (cast needed as we keep the type minimal)
  (req as unknown as Record<string, unknown>)['authContext'] = ctx;
  next();
}
