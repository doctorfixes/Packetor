/**
 * Procore integration adapter (v1.0).
 *
 * Provides the interface for submitting and retrieving packets
 * via the Procore construction management platform.
 *
 * To implement:
 * 1. Register an OAuth2 application in the Procore Developer Portal
 * 2. Store credentials in environment variables
 * 3. Replace stub bodies with real Procore REST API calls
 */

import { StructuredPacket } from '../../structuring/structurePacket';
import {
  IntegrationAdapter,
  IntegrationResult,
  IntegrationLogEntry,
  logIntegration,
  packetHash,
} from './adapter';

export interface ProcoreConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  companyId: string;
  projectId: string;
}

/**
 * Upload a packet document to a Procore project.
 * Returns a stub document reference URL.
 */
export async function uploadToProcore(
  config: ProcoreConfig,
  filename: string,
  content: string
): Promise<string> {
  // TODO: authenticate with Procore OAuth2 and POST to /rest/v1.0/projects/{id}/documents
  void content;
  console.warn(
    `Procore upload stub: would upload "${filename}" to company=${config.companyId} project=${config.projectId}`
  );
  return `${config.baseUrl}/rest/v1.0/projects/${config.projectId}/documents/${filename}`;
}

/**
 * Retrieve a packet document from a Procore project.
 * Returns the file content as a string.
 */
export async function downloadFromProcore(
  config: ProcoreConfig,
  filename: string
): Promise<string> {
  // TODO: authenticate with Procore OAuth2 and GET /rest/v1.0/projects/{id}/documents/{filename}
  void config;
  console.warn(
    `Procore download stub: would download "${filename}" from project=${config.projectId}`
  );
  return '';
}

/**
 * IntegrationAdapter implementation for Procore REST API.
 * Resolves configuration from environment variables at send-time.
 */
export class ProcoreAdapter implements IntegrationAdapter {
  readonly name = 'procore';

  constructor(private readonly config: ProcoreConfig) {}

  async send(packet: StructuredPacket, tenant: string): Promise<IntegrationResult> {
    const start = Date.now();
    const filename = `${packet.sourceName.replace(/[^a-zA-Z0-9._-]/g, '_')}-${Date.now()}.md`;
    let responseId = '';
    let resourceUrl = '';
    let status: IntegrationLogEntry['status'] = 'success';
    let error: string | undefined;

    try {
      resourceUrl = await uploadToProcore(this.config, filename, packet.rawText);
      responseId = filename;
    } catch (err) {
      status = 'error';
      error = err instanceof Error ? err.message : String(err);
      throw err;
    } finally {
      const entry: IntegrationLogEntry = {
        timestamp: new Date().toISOString(),
        tenant,
        integration: this.name,
        status,
        latencyMs: Date.now() - start,
        packetHash: packetHash(packet),
        responseId,
        ...(error !== undefined ? { error } : {}),
      };
      logIntegration(entry);
    }

    return { responseId, resourceUrl };
  }
}
