import { StructuredPacket } from '../../structuring/structurePacket';
import { hashString } from '../../governance/hash';

/**
 * Common integration result returned by every adapter.
 */
export interface IntegrationResult {
  /** Provider-assigned identifier for the created/updated resource. */
  responseId: string;
  /** Full URL or URI of the remote resource. */
  resourceUrl: string;
}

/**
 * Canonical adapter interface that every enterprise integration must implement.
 * Tenant credentials and endpoint configuration are resolved internally by
 * each adapter implementation from environment variables or a secrets store.
 */
export interface IntegrationAdapter {
  /** Human-readable name of the target system (e.g. "salesforce", "sharepoint"). */
  readonly name: string;

  /**
   * Send a structured packet to the target system on behalf of a tenant.
   * Implementations MUST call {@link logIntegration} before returning.
   *
   * @param packet - The fully-structured packet to transmit.
   * @param tenant - The tenant identifier scoping credentials and routing.
   * @returns A resolved {@link IntegrationResult} containing the remote reference.
   */
  send(packet: StructuredPacket, tenant: string): Promise<IntegrationResult>;
}

/**
 * Shape of a governance log entry written for every outbound integration call.
 */
export interface IntegrationLogEntry {
  timestamp: string;
  tenant: string;
  integration: string;
  status: 'success' | 'error';
  latencyMs: number;
  packetHash: string;
  responseId: string;
  error?: string;
}

/**
 * Write a structured governance log entry for an integration call.
 * Emits to stdout as NDJSON so it is captured by any log aggregator.
 * Errors during logging are swallowed to protect the calling process.
 */
export function logIntegration(entry: IntegrationLogEntry): void {
  try {
    process.stdout.write(JSON.stringify(entry) + '\n');
  } catch {
    // Governance logging must never crash the main process
  }
}

/**
 * Compute a canonical SHA-256 hash for a packet's raw text.
 * Used as the `packetHash` field in {@link IntegrationLogEntry}.
 */
export function packetHash(packet: StructuredPacket): string {
  return `sha256-${hashString(packet.rawText)}`;
}
