/**
 * Salesforce integration adapter (v1.0).
 *
 * Provides the interface for pushing and querying packets
 * via the Salesforce REST API.
 *
 * To implement:
 * 1. Create a Connected App in Salesforce Setup
 * 2. Store OAuth2 credentials in environment variables
 * 3. Replace stub bodies with real Salesforce REST API calls
 */

import { StructuredPacket } from '../../structuring/structurePacket';
import {
  IntegrationAdapter,
  IntegrationResult,
  IntegrationLogEntry,
  logIntegration,
  packetHash,
} from './adapter';

export interface SalesforceConfig {
  instanceUrl: string;
  clientId: string;
  clientSecret: string;
  apiVersion: string;
}

/**
 * Push a packet as a Salesforce object (e.g. ContentDocument / Case).
 * Returns a stub record URL.
 */
export async function pushToSalesforce(
  config: SalesforceConfig,
  objectType: string,
  payload: unknown
): Promise<string> {
  // TODO: obtain OAuth2 access token and POST to {instanceUrl}/services/data/{apiVersion}/sobjects/{objectType}
  void payload;
  console.warn(
    `Salesforce stub: would POST ${objectType} to ${config.instanceUrl} (API ${config.apiVersion})`
  );
  return `${config.instanceUrl}/services/data/${config.apiVersion}/sobjects/${objectType}/stub-id`;
}

/**
 * Query Salesforce using SOQL.
 * Returns the raw query response as a JSON string.
 */
export async function queryFromSalesforce(
  config: SalesforceConfig,
  soql: string
): Promise<string> {
  // TODO: obtain OAuth2 access token and GET {instanceUrl}/services/data/{apiVersion}/query?q={soql}
  void config;
  void soql;
  console.warn(
    `Salesforce stub: would run SOQL query on ${config.instanceUrl}`
  );
  return '';
}

/**
 * IntegrationAdapter implementation for Salesforce REST + OAuth.
 * Resolves configuration from environment variables at send-time.
 */
export class SalesforceAdapter implements IntegrationAdapter {
  readonly name = 'salesforce';

  constructor(private readonly config: SalesforceConfig) {}

  async send(packet: StructuredPacket, tenant: string): Promise<IntegrationResult> {
    const start = Date.now();
    let responseId = '';
    let resourceUrl = '';
    let status: IntegrationLogEntry['status'] = 'success';
    let error: string | undefined;

    try {
      resourceUrl = await pushToSalesforce(this.config, 'Case', { body: packet.rawText });
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
