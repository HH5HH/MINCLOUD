# UnderPar Agent Guidelines

## Core Doctrine

- Compress workflows to 3-5 actions when possible.
- Do not replace systems of record; orchestrate around them.
- Protect credential integrity (no credential downgrades, leakage, or bypass shortcuts).
- Track friction reduction with measurable before/after metrics.
- For every feature decision, ask: "Is this UnderPar compliant?"

## Adobe Spectrum 2 Skill Integration

- For UI styling or component work, use the `$spectrum-css-core` skill.
- Keep implementations class-based Spectrum CSS (not Spectrum Web Components details).
- Use Spectrum 2 compliant classes and avoid legacy/express/large variants.
- Prefer token-driven styling and component package usage aligned with Spectrum guidance.
- When choosing components or tokens, consult Spectrum 2 docs/tokens MCP data first.

## Delivery Guardrails

- Prioritize measurable compression outcomes over visual-only changes.
- Any UI change should include expected friction reduction impact.
- If a request conflicts with doctrine, propose the closest compliant alternative.
