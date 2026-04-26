import { Request } from 'express';

/**
 * Tenant routing scaffolding (v1.0 placeholder).
 *
 * Resolves the active tenant from a request and provides
 * tenant-scoped configuration. Extend for multi-tenant deployments.
 */

export interface Tenant {
  id: string;
  name: string;
  storagePath: string;
  rulepack?: string;
}

const DEFAULT_TENANT: Tenant = {
  id: 'default',
  name: 'Default Tenant',
  storagePath: 'tenants/default',
};

/** In-memory tenant registry – replace with a DB/config store in production. */
const tenantRegistry = new Map<string, Tenant>([
  ['default', DEFAULT_TENANT],
]);

/**
 * Register a new tenant at runtime.
 */
export function registerTenant(tenant: Tenant): void {
  tenantRegistry.set(tenant.id, tenant);
}

/**
 * Resolve a tenant by ID. Returns the default tenant if not found.
 */
export function resolveTenant(tenantId: string): Tenant {
  return tenantRegistry.get(tenantId) ?? DEFAULT_TENANT;
}

/**
 * Extract the tenant ID from an HTTP request.
 * Reads the x-tenant-id header; falls back to "default".
 */
export function getTenant(req: Request): string {
  const header = req.headers['x-tenant-id'];
  if (typeof header === 'string' && header.trim()) {
    return header.trim();
  }
  return 'default';
}
