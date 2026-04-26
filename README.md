# Packetor
Deterministic Document‑to‑Packet Engine

Packetor ingests messy documents (PDFs, images, raw text), extracts and normalizes their content, and produces clean, structured, audit‑ready Markdown packets. Every run is deterministic: the same input always produces the same output, with full governance logging and optional domain‑specific rule‑packs.

---

## 🚀 Features

- Deterministic document → packet transformation
- PDF text extraction (pdf‑parse)
- OCR‑ready architecture (stub included)
- Summary, key facts, timeline, and risk‑flag generation
- Domain‑specific rule‑packs (insurance, healthcare, legal, logistics, construction)
- Governance layer: hashing, drift detection, strict‑mode validation, audit logs
- Multi‑tenant scaffolding
- CLI + REST API + minimal browser UI
- Vitest test suite (core, governance, rule‑packs, enterprise, fuzzing)

---

## 🧠 Architecture

```
Input (file or text)
    ↓
Ingestion (src/ingestion/)
    ↓
Extraction (src/extraction/)    ← PDF parsing, OCR stub
    ↓
Structuring (src/structuring/)  ← summarize, extractFacts, buildTimeline
    ↓
Rule-Pack (optional overlay)    ← domain-specific enrichment
    ↓
Governance (src/governance/)    ← hash, enforce, log
    ↓
Output (src/output/)            ← render to Markdown
```

The central orchestrator is:

```
src/api/packet.ts
```

It wires all stages together for both file and text inputs.

---

## 📁 Directory Structure

```
src/
├── api/packet.ts
├── server/
│   ├── index.ts
│   └── routes.ts
├── ingestion/
│   ├── fileIngest.ts
│   └── textIngest.ts
├── extraction/
│   ├── extractText.ts
│   └── ocr.ts
├── structuring/
│   ├── structurePacket.ts
│   ├── summarize.ts
│   ├── extractFacts.ts
│   ├── buildTimeline.ts
│   └── applyRulePack.ts
├── output/
│   └── renderMarkdown.ts
├── governance/
│   ├── hash.ts
│   ├── log.ts
│   ├── drift.ts
│   └── enforce.ts
├── rulepacks/
│   ├── loader.ts
│   ├── validate.ts
│   ├── registry.json
│   ├── insurance/
│   ├── healthcare/
│   ├── legal/
│   ├── logistics/
│   └── construction/
├── enterprise/
│   ├── auth.ts
│   ├── tenant.ts
│   ├── storage.ts
│   └── integrations/
├── cli/packetor.ts
public/
templates/
tests/
governance.config.json
tsconfig.json
```

---

## 📦 StructuredPacket Model

```ts
interface StructuredPacket {
  sourceName: string;
  summary: string;
  facts: Fact[];
  timeline: TimelineEntry[];
  riskFlags: string[];
  rawText: string;
}
```

---

## 🧩 Rule‑Packs

Rule‑packs are domain‑specific overlays that extend the generic structuring step.

Each pack provides:

- `factRules(text)`
- `timelineRules(text)`
- `riskFlags(text)`
- `template.md`

Allowlisted in:

```
src/rulepacks/registry.json
```

Loaded via:

```
src/rulepacks/loader.ts
```

Validated via:

```
src/rulepacks/validate.ts
```

---

## 🛡 Governance

Every packet is governed:

- **Hashing** — SHA‑hash input + output
- **Drift detection** — detect unexpected output changes
- **Strict‑mode** — validate packet structure before output
- **Audit logging** — append JSONL entries to:

```
logs/<tenant>/packets.jsonl
```

---

## 🏢 Multi‑Tenancy

`getTenant(req)` extracts a tenant identifier.

All logs and storage paths are tenant‑scoped:

```
tenants/<tenant>/
```

---

## 🖥 API

### POST `/api/packet/file`
Upload a file.

### POST `/api/packet/text`
Submit raw text.

Both return a fully structured Markdown packet.

---

## 💻 CLI

```
npm run cli path/to/file.txt
```

Outputs Markdown to stdout.

---

## 🧪 Tests

Run all tests:

```
npm test
```

Includes:

- Core engine tests
- Governance tests
- Rule‑pack tests
- Enterprise tests
- Integration tests
- Monte Carlo fuzzing

---

## 🏁 Development

Start dev server:

```
npm run dev
```

Build for production:

```
npm run build
npm start
```

---

## 📄 License

MIT
