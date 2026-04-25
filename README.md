# Packetor

**Packetor** is a deterministic engine that turns messy documents into clean, structured, audit‑ready packets.

Upload → Extract → Structure → Packet.

---

## What Packetor does

- Ingests PDFs, images, and text
- Extracts and normalizes content
- Structures it into:
  - Summary
  - Key facts
  - Timeline
  - Attachments
- Outputs a clean, markdown evidence packet

With rule‑packs and governance, Packetor becomes packet infrastructure for operations.

---

## Quick start

### 1. Install

```bash
git clone https://github.com/<org>/packetor.git
cd packetor
npm install
```

### 2. Run dev server

```bash
npm run dev
```

Open http://localhost:3000 and:

- Upload a file or
- Paste text
- Click **Generate Packet**

You'll see a markdown packet in the output panel.

### 3. CLI usage

```bash
npm run cli path/to/file.txt
```

Prints a packet to stdout.

---

## Project structure

- `public/` — minimal UI (HTML/CSS)
- `src/server/` — Express server + routes
- `src/api/packet.ts` — main packet generation API
- `src/ingestion/` — file and text ingestion
- `src/extraction/` — PDF and OCR stubs
- `src/structuring/` — summary, facts, timeline, packet assembly
- `src/output/` — markdown renderer
- `src/governance/` — hashing, logging, drift detection (v0.2)
- `src/rulepacks/` — rule‑pack loader + insurance rule‑pack (v0.3)
- `src/enterprise/` — auth/tenant/integration scaffolding (v1.0)

---

## Governance (v0.2)

Packetor logs each packet generation:

- Input hash
- Output hash
- Template version
- Rule‑pack version
- Engine version
- Timestamp

Logs are written to `logs/packets.jsonl`.

---

## Rule‑packs (v0.3)

Rule‑packs add domain‑specific intelligence.

Example: `rulepacks/insurance/v1`:

- `template.md`
- `factRules.ts`
- `timelineRules.ts`
- `riskFlags.ts`

The engine can load a rule‑pack by name + version and merge its outputs into the packet.

---

## Enterprise scaffolding (v1.0)

The `enterprise/` folder contains placeholders for:

- Auth (`auth.ts`)
- Tenant routing (`tenant.ts`)
- Tenant‑scoped storage (`storage.ts`)
- Integrations (e.g. `integrations/sharepoint.ts`)

These are intentionally minimal and ready to be wired into a real deployment.

---

## Development notes

- Written in TypeScript
- Designed for deterministic, testable behavior
- Governance and rule‑packs are additive layers, not rewrites

---

## Roadmap (high level)

- v0.2 — Governance layer (versioning, logs, drift)
- v0.3 — Rule‑pack engine (multi‑vertical)
- v1.0 — Enterprise (auth, tenants, integrations, compliance)

---

## License

TBD.
