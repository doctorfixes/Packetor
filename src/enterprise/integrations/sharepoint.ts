/**
 * SharePoint integration stub (v1.0 placeholder).
 *
 * This module provides the interface for uploading and downloading
 * packets to/from a SharePoint document library.
 *
 * To implement:
 * 1. Install @microsoft/microsoft-graph-client
 * 2. Configure OAuth2 credentials in environment variables
 * 3. Replace the stub bodies below with real Graph API calls
 */

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
