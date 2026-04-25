import { UploadedFile } from 'express-fileupload';
import { ingestFile } from '../ingestion/fileIngest';
import { ingestText } from '../ingestion/textIngest';
import { structurePacket, StructuredPacket } from '../structuring/structurePacket';
import { applyRulePack } from '../structuring/applyRulePack';
import { renderMarkdown } from '../output/renderMarkdown';
import { hashString } from '../governance/hash';
import { logPacket } from '../governance/log';

export const ENGINE_VERSION = '0.2.0';
export const TEMPLATE_VERSION = 'generic/v1';

export async function generatePacketFromFile(
  file: UploadedFile,
  rulepack?: string
): Promise<string> {
  const raw = await ingestFile(file);
  return buildPacket(raw, file.name, rulepack);
}

export async function generatePacketFromText(
  text: string,
  rulepack?: string
): Promise<string> {
  const raw = ingestText(text);
  return buildPacket(raw, 'text-input', rulepack);
}

async function buildPacket(
  rawText: string,
  sourceName: string,
  rulepack?: string
): Promise<string> {
  const inputHash = hashString(rawText);

  let structured: StructuredPacket = structurePacket(rawText, sourceName);

  if (rulepack) {
    structured = await applyRulePack(structured, rulepack);
  }

  const markdown = renderMarkdown(structured);
  const outputHash = hashString(markdown);

  logPacket({
    inputHash,
    outputHash,
    templateVersion: TEMPLATE_VERSION,
    rulepackVersion: rulepack ?? 'none',
    engineVersion: ENGINE_VERSION,
    sourceName,
  });

  return markdown;
}
