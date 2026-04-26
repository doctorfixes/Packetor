/**
 * Epic EHR integration adapter (v1.0).
 *
 * Provides the interface for sending and retrieving clinical packets
 * via Epic's FHIR R4 / REST APIs.
 *
 * To implement:
 * 1. Register an application in Epic's App Market / MyApps portal
 * 2. Store OAuth2 credentials in environment variables
 * 3. Replace stub bodies with real FHIR API calls
 */

import { StructuredPacket } from '../../structuring/structurePacket';
import {
  IntegrationAdapter,
  IntegrationResult,
  IntegrationLogEntry,
  logIntegration,
  packetHash,
} from './adapter';

export interface EpicConfig {
  fhirBaseUrl: string;
  clientId: string;
  clientSecret: string;
  tenantId: string;
}

/**
 * Send a clinical packet to an Epic FHIR endpoint (e.g. DocumentReference).
 * Returns a stub resource reference URL.
 */
export async function sendToEpic(
  config: EpicConfig,
  resourceType: string,
  payload: unknown
): Promise<string> {
  // TODO: authenticate with Epic OAuth2 and POST to {fhirBaseUrl}/{resourceType}
  void payload;
  console.warn(
    `Epic stub: would POST ${resourceType} to ${config.fhirBaseUrl} (tenant=${config.tenantId})`
  );
  return `${config.fhirBaseUrl}/${resourceType}/stub-id`;
}

/**
 * Retrieve a clinical resource from Epic by resource type and ID.
 * Returns the raw FHIR resource as a JSON string.
 */
export async function fetchFromEpic(
  config: EpicConfig,
  resourceType: string,
  resourceId: string
): Promise<string> {
  // TODO: authenticate with Epic OAuth2 and GET {fhirBaseUrl}/{resourceType}/{resourceId}
  void config;
  console.warn(
    `Epic stub: would GET ${resourceType}/${resourceId} from ${config.fhirBaseUrl}`
  );
  return '';
}

/**
 * IntegrationAdapter implementation for Epic FHIR.
 * Resolves configuration from environment variables at send-time.
 */
export class EpicAdapter implements IntegrationAdapter {
  readonly name = 'epic';

  constructor(private readonly config: EpicConfig) {}

  async send(packet: StructuredPacket, tenant: string): Promise<IntegrationResult> {
    const start = Date.now();
    let responseId = '';
    let resourceUrl = '';
    let status: IntegrationLogEntry['status'] = 'success';
    let error: string | undefined;

    try {
      resourceUrl = await sendToEpic(this.config, 'DocumentReference', { body: packet.rawText });
      responseId = resourceUrl.split('/').pop() || '';
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
