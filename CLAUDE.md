# Pebble Playground — Claude Code

Read `AGENTS.md` for the canonical Pebble reference (gotchas, tokens, patterns, troubleshooting). Claude Code auto-loads both files.

## Claude Code-specific notes

- **Use `npm run`, never `yarn`** — Yarn fails with `Failed to replace env in config: ${NPM_TOKEN}`.
- Pebble MCP is available for component API lookup — see `.cursor/rules/pebble-mcp.mdc` for when to use it.
