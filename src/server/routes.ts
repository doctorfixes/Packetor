import { Application, Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { generatePacketFromFile, generatePacketFromText } from '../api/packet';
import { getTenant } from '../enterprise/tenant';

export function registerRoutes(app: Application): void {
  app.post('/api/packet/file', async (req: Request, res: Response) => {
    try {
      if (!req.files || !req.files.file) {
        res.status(400).json({ error: 'No file uploaded.' });
        return;
      }
      const uploaded = req.files.file as UploadedFile;
      const rulepack = typeof req.body.rulepack === 'string' ? req.body.rulepack : undefined;
      const tenant = getTenant(req);
      const packet = await generatePacketFromFile(uploaded, rulepack, tenant);
      res.json({ packet });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: message });
    }
  });

  app.post('/api/packet/text', async (req: Request, res: Response) => {
    try {
      const { text, rulepack } = req.body as { text?: string; rulepack?: string };
      if (!text || typeof text !== 'string') {
        res.status(400).json({ error: 'Missing or invalid "text" field.' });
        return;
      }
      const tenant = getTenant(req);
      const packet = await generatePacketFromText(text, rulepack, tenant);
      res.json({ packet });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: message });
    }
  });
}
