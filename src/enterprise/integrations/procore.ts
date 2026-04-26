/**
 * Procore integration stub (v1.0 placeholder).
 *
 * Provides the interface for submitting and retrieving packets
 * via the Procore construction management platform.
 *
 * To implement:
 * 1. Register an OAuth2 application in the Procore Developer Portal
 * 2. Store credentials in environment variables
 * 3. Replace stub bodies with real Procore REST API calls
 */

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
