/**
 * Authentication module (v1.0).
 *
 * Provides JWT-based bearer token verification and Express-compatible
 * middleware for tenant-scoped authentication.
 *
 * Auth flow:
 *   1. User hits /auth/login → redirect to IdP (Microsoft Entra ID, Okta, Google Workspace)
 *   2. IdP returns a signed JWT / SAML assertion
 *   3. Packetor verifies the token signature and expiry
 *   4. Tenant is resolved from claims: tenant_id, hd (Google), or custom:tenant
 *   5. AuthContext is attached to the request for downstream handlers
 *
 * Token model:
 *   - Access token:  15-minute TTL, signed with rotating RS256 keys
 *   - Refresh token: 24-hour TTL, stored server-side
 *
 * Security controls:
 *   - Strict CORS
 *   - Rate limiting (configured at the reverse-proxy layer)
 *   - Session governance logs
 *   - IP allowlists (optional, via ALLOWED_IPS env var)
 *
 * Replace the stub verification below with a real JWKS fetch + jwt.verify()
 * call (e.g. using the `jose` or `jsonwebtoken` library) for production.
 */

export interface AuthContext {
  userId: string;
  tenantId: string;
  roles: string[];
}

/**
 * Extract the raw bearer token string from an Authorization header value.
 * Returns null when the header is absent or not a Bearer scheme.
 */
export function extractBearerToken(
  authHeader: string | string[] | undefined
): string | null {
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return null;
}

/**
 * Verify a bearer token and decode its claims into an AuthContext.
 *
 * Production implementation should:
 *   - Fetch the IdP JWKS endpoint and verify the RS256 signature
 *   - Validate `iss`, `aud`, `exp`, and `nbf` standard claims
 *   - Resolve tenant from `tenant_id`, `hd` (Google hd claim), or `custom:tenant`
 *
 * Currently returns a stub context – replace with real verification logic.
 */
export function verifyJwt(token: string): AuthContext | null {
  // TODO: validate JWT signature against IdP JWKS, check exp/iss/aud claims
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
 * Verify an incoming bearer token and return an AuthContext.
 * Delegates to {@link verifyJwt}.
 */
export function verifyToken(token: string): AuthContext | null {
  return verifyJwt(token);
}

/**
 * Express-compatible middleware that checks for a valid bearer token.
 * On success, attaches an `authContext` property to the request object.
 */
export function authMiddleware(
  req: { headers: Record<string, string | string[] | undefined> },
  res: { status: (code: number) => { json: (body: unknown) => void } },
  next: () => void
): void {
  const token = extractBearerToken(req.headers['authorization']);

  if (!token) {
    res.status(401).json({ error: 'Unauthorized: missing token.' });
    return;
  }

  const ctx = verifyJwt(token);
  if (!ctx) {
    res.status(403).json({ error: 'Forbidden: invalid token.' });
    return;
  }

  // Attach context to request (cast needed as we keep the type minimal)
  (req as unknown as Record<string, unknown>)['authContext'] = ctx;
  next();
}
