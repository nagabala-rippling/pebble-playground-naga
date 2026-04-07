# Pebble Playground — Claude Code

Read `AGENTS.md` for the canonical Pebble reference (gotchas, tokens, patterns, troubleshooting). Claude Code auto-loads both files.

## Claude Code-specific notes

- **Use `npm run`, never `yarn`** — Yarn fails with `Failed to replace env in config: ${NPM_TOKEN}`.
- Pebble MCP is available for component API lookup — see the "Pebble MCP" section in `AGENTS.md` for when to use it.
- **Skills** live in `agents/skills/`. When the user asks to start a new playground or workspace, read and follow `agents/skills/new-playground/SKILL.md`. When the user asks to create a new prototype or demo (or describes a UI to build), read and follow `agents/skills/new-prototype/SKILL.md`. When the user asks to deploy, share, or publish, read and follow `agents/skills/deploy-playground/SKILL.md`.
