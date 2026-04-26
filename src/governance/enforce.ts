export function enforceStrictMode({ summary, facts, timeline }: {
  summary: string;
  facts: unknown[];
  timeline: unknown[];
}) {
  if (!summary || typeof summary !== "string") {
    throw new Error("Strict mode: summary missing or invalid");
  }

  if (!Array.isArray(facts)) {
    throw new Error("Strict mode: facts must be an array");
  }

  if (!Array.isArray(timeline)) {
    throw new Error("Strict mode: timeline must be an array");
  }

  return true;
}
