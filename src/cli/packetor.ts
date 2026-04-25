import path from 'path';
import fs from 'fs';
import { generatePacketFromFile, generatePacketFromText } from '../api/packet';

// Minimal shim so generatePacketFromFile can accept a plain file path from CLI
import { UploadedFile } from 'express-fileupload';

function makeUploadedFile(filePath: string): UploadedFile {
  const data = fs.readFileSync(filePath);
  const name = path.basename(filePath);
  const mimetype = name.endsWith('.pdf') ? 'application/pdf' : 'text/plain';
  return {
    name,
    data,
    size: data.length,
    mimetype,
    encoding: 'binary',
    tempFilePath: '',
    truncated: false,
    md5: '',
    mv: () => Promise.resolve(),
  } as unknown as UploadedFile;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: npm run cli <file-path> [rulepack]');
    console.error('       npm run cli --text "some text" [rulepack]');
    process.exit(1);
  }

  let packet: string;

  if (args[0] === '--text') {
    const text = args[1];
    const rulepack = args[2];
    if (!text) {
      console.error('--text requires a text argument.');
      process.exit(1);
    }
    packet = await generatePacketFromText(text, rulepack);
  } else {
    const filePath = path.resolve(args[0]);
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }
    const rulepack = args[1];
    const uploadedFile = makeUploadedFile(filePath);
    packet = await generatePacketFromFile(uploadedFile, rulepack);
  }

  console.log(packet);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
