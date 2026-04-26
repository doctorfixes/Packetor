/**
 * Salesforce integration stub (v1.0 placeholder).
 *
 * Provides the interface for pushing and querying packets
 * via the Salesforce REST API.
 *
 * To implement:
 * 1. Create a Connected App in Salesforce Setup
 * 2. Store OAuth2 credentials in environment variables
 * 3. Replace stub bodies with real Salesforce REST API calls
 */

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
