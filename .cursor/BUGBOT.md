# Pebble Playground — Bugbot Review Rules

## Tech Stack

- React 18 + TypeScript (strict mode) + Vite
- `@rippling/pebble` — Rippling's component library
- `@rippling/pebble-tokens` — Design tokens
- Emotion CSS-in-JS (`@emotion/styled`, `@emotion/react`)
- React Router v7
- Path alias: `@/*` maps to `./src/*`

## Key Commands

```bash
npm run dev       # Start dev server (port 4201)
npm run build     # TypeScript check + Vite build
npm run lint      # ESLint
npm run format    # Prettier
```

**Use `npm run`, never `yarn`.** Yarn fails on the GitHub Packages registry config in `.npmrc`.

## Component Gotchas — Flag These in Reviews

### Wrong Component Names

| Wrong                  | Right                                    | Why                                           |
| ---------------------- | ---------------------------------------- | --------------------------------------------- |
| `import Tooltip`       | `import Tip from '@rippling/pebble/Tip'` | Component is `Tip`, not `Tooltip`             |
| `<IconButton>`         | `<Button.Icon>`                          | It's a sub-component, not a standalone        |
| `<Typography>`         | Styled element + `theme.typestyleV2*`    | Typography component doesn't exist            |
| `<Select>`             | `<Input.Select>`                         | All input types are sub-components of `Input` |
| `<Checkbox>`           | `<Input.Checkbox>`                       | Same — use `Input.Checkbox`                   |
| `<Radio>`              | `<Input.Radio>`                          | Same — use `Input.Radio`                      |
| `<TextArea>`           | `<Input.TextArea>`                       | Same — use `Input.TextArea`                   |
| `<Modal>`              | `<Drawer>`                               | Pebble uses `Drawer` for modal patterns       |
| `<Card.Section>`       | `<Card.Layout>`                          | Use `Card.Layout`, not `Card.Section`         |
| `<Card.Header>`        | Styled elements                          | Card has no Header/Footer sub-components      |
| `<Box display="flex">` | `<HStack>` / `<VStack>`                  | Use Stack components for flex layouts         |

### Wrong API Usage

| Wrong                        | Right                            | Why                                      |
| ---------------------------- | -------------------------------- | ---------------------------------------- |
| `<Icon size={Icon.SIZES.M}>` | `<Icon size={20}>`               | Icon sizes are numbers, not constants    |
| `<Icon name="check">`        | `<Icon type={Icon.TYPES.CHECK}>` | Use `type` prop with `Icon.TYPES.*`      |
| `Input.SIZES.M`              | `Input.Text.SIZES.M`             | Size constants live on the sub-component |
| `Button.VARIANTS.ICON`       | `Button.Icon`                    | It's a sub-component, not a variant      |

## Design Token Rules — Always Flag Violations

### Hardcoded values are never acceptable

```
❌ backgroundColor: 'white'
❌ backgroundColor: '#ffffff'
❌ color: '#000000'
❌ color: 'black'
❌ padding: '16px'
❌ margin: '24px'
❌ fontSize: '14px'
❌ borderRadius: '8px'
```

### Required — use theme tokens

```
✅ backgroundColor: theme.colorSurface
✅ color: theme.colorOnSurface
✅ padding: theme.space400
✅ ${theme.typestyleV2BodyMedium}
✅ borderRadius: theme.shapeCornerLg
```

### Token categories

- **Colors**: `theme.color*` — `colorSurface`, `colorOnSurface`, `colorPrimary`, `colorError`, etc.
- **Spacing**: `theme.space*` — `space100` (4px) through `space1600` (64px)
- **Typography**: `theme.typestyleV2*` — Display, Title, Body, Label, Code variants
- **Shape**: `theme.shapeCorner*` — `Xs` (2px) through `Full` (9999px)

## Import Rules

### Always use `@/` alias

```
❌ import { usePebbleTheme } from '../utils/theme'
❌ import { usePebbleTheme } from '../../utils/theme'
❌ import logo from '../assets/logo.svg'

✅ import { usePebbleTheme } from '@/utils/theme'
✅ import logo from '@/assets/rippling-logo-black.svg'
```

## Code Review Checklist

Flag PRs that violate any of these:

1. **No hardcoded colors** — must use `theme.color*` tokens
2. **No hardcoded spacing** — must use `theme.space*` tokens
3. **No hardcoded typography** — must use `theme.typestyleV2*` tokens
4. **Icon sizes are numbers** — `size={20}`, never `Icon.SIZES.M`
5. **Input sub-components use own SIZES** — `Input.Text.SIZES.M`, not `Input.SIZES.M`
6. **Correct component names** — `Tip` not `Tooltip`, `Button.Icon` not `IconButton`
7. **`@/` alias for all shared imports** — no relative paths crossing directories
8. **All interactive icons have `aria-label`** — accessibility requirement
9. **TypeScript strict compliance** — no `any` unless justified, no `@ts-ignore`
10. **No `yarn` commands** — use `npm run` exclusively

## What This Repo Is NOT

- **Not production code** — this is a prototyping/demo environment
- **No backend** — pure frontend, no API calls to real services
- **No tests yet** — Vitest will be added later
- **No feature flags** — demos are always on
- **No i18n** — English-only prototypes
