import { UploadedFile } from 'express-fileupload';
import { ingestFile } from '../ingestion/fileIngest';
import { ingestText } from '../ingestion/textIngest';
import { structurePacket, StructuredPacket } from '../structuring/structurePacket';
import { applyRulePack } from '../structuring/applyRulePack';
import { renderMarkdown } from '../output/renderMarkdown';
import { hashString } from '../governance/hash';
import { logPacket } from '../governance/log';
import { enforceStrictMode } from '../governance/enforce';
import governanceConfig from '../../governance.config.json';

export const ENGINE_VERSION = '0.2.0';
export const TEMPLATE_VERSION = 'generic/v1';

export async function generatePacketFromFile(
  file: UploadedFile,
  rulepack?: string,
  tenant = 'default'
): Promise<string> {
  const raw = await ingestFile(file);
  return buildPacket(raw, file.name, rulepack, tenant);
}

export async function generatePacketFromText(
  text: string,
  rulepack?: string,
  tenant = 'default'
): Promise<string> {
  const raw = ingestText(text);
  return buildPacket(raw, 'text-input', rulepack, tenant);
}

async function buildPacket(
  rawText: string,
  sourceName: string,
  rulepack?: string,
  tenant = 'default'
): Promise<string> {
  const inputHash = hashString(rawText);

  let structured: StructuredPacket = structurePacket(rawText, sourceName);

  if (rulepack) {
    structured = await applyRulePack(structured, rulepack);
  }

  if (governanceConfig.strictMode) {
    enforceStrictMode(structured);
  }

  const markdown = renderMarkdown(structured);
  const outputHash = hashString(markdown);

  logPacket(
    {
      inputHash,
      outputHash,
      templateVersion: TEMPLATE_VERSION,
      rulepackVersion: rulepack ?? 'none',
      engineVersion: ENGINE_VERSION,
      sourceName,
    },
    tenant
  );

  return markdown;
}
