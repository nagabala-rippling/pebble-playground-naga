# Pebble Playground — Agent Context

## Context

- **What this is:** AI-native prototyping sandbox for Rippling's Pebble Design System. PMs and designers describe UIs in natural language, AI builds them using real production components.
- **Audience:** PMs, designers, and engineers at Rippling who want to prototype without full Rippling infrastructure.
- **Success looks like:** A working interactive demo using real Pebble components, deployable to Vercel, built in minutes not days.
- **Key constraint:** All styling must use design tokens (never hardcode colors, spacing, typography). Prototypes must look like the real Rippling product.
- **"Pebble"** = Rippling's design system and component library (`@rippling/pebble`).
- **"Pebble MCP"** = MCP server giving AI tools live access to component docs. Auto-installed via `yarn install`.

## Tech Stack

React 18 + TypeScript (strict) + Vite (port 4201) + Emotion CSS-in-JS + React Router v7.
Components from `@rippling/pebble`, tokens from `@rippling/pebble-tokens`.
Always use `@/` import alias (maps to `./src/*`).

## Critical Rules

| Component       | Wrong                                             | Right                                            | Notes                                          |
| --------------- | ------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------- |
| **Tooltip**     | `import Tooltip`                                  | `import Tip from '@rippling/pebble/Tip'`         | Component is called `Tip`, not `Tooltip`       |
| **Icon**        | `<Icon size={Icon.SIZES.M} />`                    | `<Icon size={20} />`                             | Use numbers for size, not constants            |
| **Icon**        | `<Icon name="check" />`                           | `<Icon type={Icon.TYPES.CHECK} />`               | Use `type` prop with `Icon.TYPES.*`            |
| **Input**       | `Input.SIZES.M`                                   | `Input.Text.SIZES.M`                             | Size constant is on the sub-component          |
| **Button**      | `<IconButton icon="x" />`                         | `<Button.Icon icon={Icon.TYPES.CLOSE} />`        | Use `Button.Icon`, not `IconButton`            |
| **Button**      | `Button.VARIANTS.ICON`                            | `Button.Icon`                                    | It's a sub-component, not a variant            |
| **Card**        | `<Card.Section>`                                  | `<Card.Layout padding={...}>`                    | Use `Card.Layout`, not `Card.Section`          |
| **Card**        | `<Card.Header>`                                   | Just use styled elements                         | Card doesn't have Header/Footer sub-components |
| **Typography**  | `<Typography variant="h1">`                       | Use styled components + typestyle tokens         | Typography component doesn't exist!            |
| **Select**      | `<Select options={[...]} />`                      | `<Input.Select options={[...]} />`               | Select is `Input.Select`                       |
| **Checkbox**    | `<Checkbox />`                                    | `<Input.Checkbox />`                             | Checkbox is `Input.Checkbox`                   |
| **Radio**       | `<Radio />`                                       | `<Input.Radio />`                                | Radio is `Input.Radio`                         |
| **TextArea**    | `<TextArea />`                                    | `<Input.TextArea />`                             | TextArea is `Input.TextArea`                   |
| **Modal**       | `<Modal>`                                         | `<Drawer>` or check MCP                          | Pebble uses `Drawer` for most modal patterns   |
| **Empty State** | Custom Card + styled text                         | `<ActionCard>`                                   | Use ActionCard for empty states with CTAs      |
| **Layout**      | `<Box display="flex">`                            | `<HStack>` or `<VStack>`                         | Use Stack components for flex layouts          |
| **Colors**      | `backgroundColor: 'white'`                        | `backgroundColor: theme.colorSurface`            | Never hardcode colors                          |
| **Colors**      | `color: '#000'`                                   | `color: theme.colorOnSurface`                    | Never hardcode colors                          |
| **Spacing**     | `padding: '16px'`                                 | `padding: theme.space400`                        | Never hardcode spacing                         |
| **Imports**     | `import { usePebbleTheme } from '../utils/theme'` | `import { usePebbleTheme } from '@/utils/theme'` | Always use `@/` alias                          |

## Commands

```bash
npm run dev           # Start dev server (port 4201) — use npm, NOT yarn (yarn fails on GitHub Packages registry config)
npm run build         # TypeScript check + Vite build
npm run new:demo      # Scaffold a new demo
npm run override      # Override a Pebble component
```

## Deeper Reference

For detailed component APIs, tokens, and patterns:

- `CLAUDE.md` — Claude Code reference (gotchas, imports, tokens, patterns)
- `AI_CONTEXT.md` — Workflow steps, styling patterns, troubleshooting
- `.cursorrules` — Cursor-specific reference with MCP usage guidance
- `docs/COMPONENT_CATALOG.md` — Full component API reference
- `docs/TOKEN_CATALOG.md` — Full design token reference
- `docs/AI_PROMPTING_GUIDE.md` — Detailed usage patterns

## Note on Context File Duplication

This repo has three overlapping context files (`CLAUDE.md`, `AI_CONTEXT.md`, `.cursorrules`) with significant duplication (~1,200 lines total). The component gotchas table above is the canonical copy. Known issues:

- Updates to one file don't propagate to others (drift risk)
- `AI_CONTEXT.md` has stale V1 typestyle tokens (`typestyleDisplayLarge600`); `CLAUDE.md` has correct V2 tokens (`typestyleV2DisplayLarge`)
- `.cursorrules` uses legacy format — modern Cursor uses `.cursor/rules/`

Future cleanup should consolidate into `AGENTS.md` (universal) + `.cursor/rules/` (Cursor-specific) and retire the duplicated content. Coordinate with Paul Best before restructuring.
