/**
 * SharePoint integration adapter (v1.0).
 *
 * This module provides the interface for uploading and downloading
 * packets to/from a SharePoint document library via Microsoft Graph.
 *
 * To implement:
 * 1. Install @microsoft/microsoft-graph-client
 * 2. Configure OAuth2 credentials in environment variables
 * 3. Replace the stub bodies below with real Graph API calls
 */

import { StructuredPacket } from '../../structuring/structurePacket';
import {
  IntegrationAdapter,
  IntegrationResult,
  IntegrationLogEntry,
  logIntegration,
  packetHash,
} from './adapter';

export interface SharePointConfig {
  siteUrl: string;
  libraryName: string;
  clientId: string;
  clientSecret: string;
  tenantId: string;
}

/**
 * Upload a packet document to a SharePoint library.
 * Returns the remote URL of the uploaded file.
 */
export async function uploadToSharePoint(
  config: SharePointConfig,
  filename: string,
  content: string
): Promise<string> {
  // TODO: authenticate with Microsoft Graph and upload file
  void config;
  void content;
  console.warn(`SharePoint upload stub: would upload "${filename}" to ${config.siteUrl}/${config.libraryName}`);
  return `${config.siteUrl}/${config.libraryName}/${filename}`;
}

/**
 * Download a packet document from a SharePoint library.
 * Returns the file content as a string.
 */
export async function downloadFromSharePoint(
  config: SharePointConfig,
  filename: string
): Promise<string> {
  // TODO: authenticate with Microsoft Graph and download file
  void config;
  console.warn(`SharePoint download stub: would download "${filename}" from ${config.siteUrl}/${config.libraryName}`);
  return '';
}

/**
 * IntegrationAdapter implementation for SharePoint / Microsoft Graph.
 * Resolves configuration from environment variables at send-time.
 */
export class SharePointAdapter implements IntegrationAdapter {
  readonly name = 'sharepoint';

  constructor(private readonly config: SharePointConfig) {}

  async send(packet: StructuredPacket, tenant: string): Promise<IntegrationResult> {
    const start = Date.now();
    const filename = `${packet.sourceName.replace(/[^a-zA-Z0-9._-]/g, '_')}-${Date.now()}.md`;
    let responseId = '';
    let resourceUrl = '';
    let status: IntegrationLogEntry['status'] = 'success';
    let error: string | undefined;

    try {
      resourceUrl = await uploadToSharePoint(this.config, filename, packet.rawText);
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
