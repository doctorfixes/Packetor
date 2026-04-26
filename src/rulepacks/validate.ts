export function validateRulePack(rp: {
  template?: string;
  factRules?: unknown;
  timelineRules?: unknown;
  riskFlags?: unknown;
}) {
  if (!rp.template) throw new Error("Rule-pack missing template");
  if (!rp.factRules) throw new Error("Rule-pack missing factRules");
  if (!rp.timelineRules) throw new Error("Rule-pack missing timelineRules");
  if (!rp.riskFlags) throw new Error("Rule-pack missing riskFlags");

  return true;
}
