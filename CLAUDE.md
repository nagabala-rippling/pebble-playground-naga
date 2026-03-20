# Pebble Playground — Claude Code Rules

**Pebble Playground** is a prototyping environment for Rippling's Pebble Design System. Build functional UI demos using real Pebble components with theme tokens. All styling must use design tokens — never hardcode colors, spacing, or typography.

## Tech Stack

- React 18 + TypeScript (strict) + Vite (port 4201)
- `@rippling/pebble` — Rippling's component library
- `@rippling/pebble-tokens` — Design tokens
- Emotion CSS-in-JS (`@emotion/styled`, `@emotion/react`)
- React Router v7
- Path alias: `@/*` maps to `./src/*` — always use `@/` for imports

## Component Gotchas (Check Before Writing Any Component Code)

| Component | Wrong | Right | Notes |
|-----------|-------|-------|-------|
| **Tooltip** | `import Tooltip` | `import Tip from '@rippling/pebble/Tip'` | Component is called `Tip`, not `Tooltip` |
| **Icon** | `<Icon size={Icon.SIZES.M} />` | `<Icon size={20} />` | Use numbers for size, not constants |
| **Icon** | `<Icon name="check" />` | `<Icon type={Icon.TYPES.CHECK} />` | Use `type` prop with `Icon.TYPES.*` |
| **Input** | `Input.SIZES.M` | `Input.Text.SIZES.M` | Size constant is on the sub-component |
| **Button** | `<IconButton icon="x" />` | `<Button.Icon icon={Icon.TYPES.CLOSE} />` | Use `Button.Icon`, not `IconButton` |
| **Button** | `Button.VARIANTS.ICON` | `Button.Icon` | It's a sub-component, not a variant |
| **Card** | `<Card.Section>` | `<Card.Layout padding={...}>` | Use `Card.Layout`, not `Card.Section` |
| **Card** | `<Card.Header>` | Just use styled elements | Card doesn't have Header/Footer sub-components |
| **Typography** | `<Typography variant="h1">` | Use styled components + typestyle tokens | Typography component doesn't exist! |
| **Select** | `<Select options={[...]} />` | `<Input.Select options={[...]} />` | Select is `Input.Select` |
| **Checkbox** | `<Checkbox />` | `<Input.Checkbox />` | Checkbox is `Input.Checkbox` |
| **Radio** | `<Radio />` | `<Input.Radio />` | Radio is `Input.Radio` |
| **TextArea** | `<TextArea />` | `<Input.TextArea />` | TextArea is `Input.TextArea` |
| **Modal** | `<Modal>` | `<Drawer>` or check MCP | Pebble uses `Drawer` for most modal patterns |
| **Empty State** | Custom Card + styled text | `<ActionCard>` | Use ActionCard for empty states with CTAs |
| **Layout** | `<Box display="flex">` | `<HStack>` or `<VStack>` | Use Stack components for flex layouts |
| **Colors** | `backgroundColor: 'white'` | `backgroundColor: theme.colorSurface` | Never hardcode colors |
| **Colors** | `color: '#000'` | `color: theme.colorOnSurface` | Never hardcode colors |
| **Spacing** | `padding: '16px'` | `padding: theme.space400` | Never hardcode spacing |
| **Imports** | `import { usePebbleTheme } from '../utils/theme'` | `import { usePebbleTheme } from '@/utils/theme'` | Always use `@/` alias |

## Common Imports

```typescript
// Layout
import { HStack, VStack } from '@rippling/pebble/Layout/Stack';
import Card from '@rippling/pebble/Card';

// Inputs
import Input from '@rippling/pebble/Inputs';       // Then: Input.Text, Input.Select, Input.Checkbox
import Button from '@rippling/pebble/Button';       // Then: Button.Icon for icon buttons

// Display
import Icon from '@rippling/pebble/Icon';
import Avatar from '@rippling/pebble/Avatar';
import Label from '@rippling/pebble/Label';
import Tip from '@rippling/pebble/Tip';             // NOT Tooltip!

// Feedback
import Drawer from '@rippling/pebble/Drawer';
import Snackbar from '@rippling/pebble/Snackbar';
import ActionCard from '@rippling/pebble/ActionCard';

// Data
import TableBasic from '@rippling/pebble/TableBasic';
import Tabs from '@rippling/pebble/Tabs';

// Theme
import { useTheme } from '@rippling/pebble/theme';
import { usePebbleTheme } from '@/utils/theme';     // Typed playground utility
```

## Common Patterns

```typescript
// Icon button
<Button.Icon
  icon={Icon.TYPES.CLOSE}
  aria-label="Close"
  appearance={Button.APPEARANCES.GHOST}
  size={Button.SIZES.S}
  onClick={handleClose}
/>

// Text input
<Input.Text
  label="Email"
  value={email}
  onChange={setEmail}
  size={Input.Text.SIZES.M}
/>

// Select
<Input.Select
  label="Country"
  options={[{ label: 'USA', value: 'us' }]}
  value={country}
  onChange={setCountry}
/>

// Card
<Card.Layout padding={Card.Layout.PADDINGS.PX_24}>
  <h2>Title</h2>
  <p>Content</p>
</Card.Layout>

// Tooltip
<Tip content="Helpful text" placement={Tip.PLACEMENTS.TOP}>
  <Button>Hover me</Button>
</Tip>

// Flex layout
<HStack gap="1rem" alignItems="center">
  <Avatar name="John" size={Avatar.SIZES.S} />
  <span>John Doe</span>
</HStack>

// Empty state
<ActionCard
  icon={Icon.TYPES.CHECKBOX_WITHCHECK_OUTLINE}
  title="No items yet"
  caption="Get started by creating your first item."
  primaryAction={{ title: 'Create item', onClick: handleCreate }}
/>

// TableBasic
<TableBasic>
  <TableBasic.THead>
    <TableBasic.Tr>
      <TableBasic.Th>Name</TableBasic.Th>
    </TableBasic.Tr>
  </TableBasic.THead>
  <TableBasic.TBody>
    <TableBasic.Tr>
      <TableBasic.Td>John Doe</TableBasic.Td>
    </TableBasic.Tr>
  </TableBasic.TBody>
</TableBasic>
```

## Theme Token Quick Reference

### Colors
```typescript
// Surfaces & backgrounds
theme.colorSurface                  // Base page background
theme.colorSurfaceBright            // Elevated cards, panels, modals
theme.colorSurfaceContainerLow     // Subtle highlights, hover states
theme.colorSurfaceContainerHigh    // Medium emphasis containers
theme.colorSurfaceContainerHighest // Strong emphasis (code blocks)

// Text & foreground
theme.colorOnSurface               // Primary text (high emphasis)
theme.colorOnSurfaceVariant        // Secondary text (descriptions, labels)
theme.colorPrimary                 // Brand color (links, primary actions)
theme.colorOnPrimary               // Text on primary backgrounds
theme.colorOnPrimaryContainer      // Text on primary container backgrounds

// Interactive elements
theme.colorPrimaryContainer        // Primary button/chip backgrounds
theme.colorSecondaryContainer      // Secondary button/chip backgrounds

// Semantic
theme.colorError / theme.colorErrorContainer
theme.colorSuccess / theme.colorSuccessContainer
theme.colorWarning

// Borders
theme.colorOutline                 // Standard borders
theme.colorOutlineVariant          // Subtle borders, dividers

// Surface color guide — when to use which:
// colorSurface                → Page background (lowest elevation)
// colorSurfaceBright          → Cards and panels (elevated)
// colorSurfaceContainerLow    → Subtle highlights, inline code, hover states
// colorSurfaceContainerHigh   → Medium emphasis containers
// colorSurfaceContainerHighest → Strong emphasis, code blocks
```

### Spacing
```typescript
theme.space100   // 4px     theme.space600   // 24px
theme.space200   // 8px     theme.space800   // 32px
theme.space300   // 12px    theme.space1000  // 40px
theme.space400   // 16px    theme.space1200  // 48px
                            theme.space1600  // 64px (hero sections)
```

### Typography (use V2 tokens)
```typescript
// Display (hero text, page titles)
theme.typestyleV2DisplayLarge      // 57px, bold
theme.typestyleV2DisplayMedium     // 45px, bold
theme.typestyleV2DisplaySmall      // 36px, bold

// Title (section headings, card titles)
theme.typestyleV2TitleLarge        // 22px, 600
theme.typestyleV2TitleMedium       // 16px, 600
theme.typestyleV2TitleSmall        // 14px, 600

// Body (content text)
theme.typestyleV2BodyLarge         // 16px, 400
theme.typestyleV2BodyMedium        // 14px, 400
theme.typestyleV2BodySmall         // 12px, 400

// Label (form labels, button text)
theme.typestyleV2LabelLarge        // 14px, 600
theme.typestyleV2LabelMedium       // 12px, 600
theme.typestyleV2LabelSmall        // 11px, 600

// Code (monospace)
theme.typestyleV2CodeLarge         // 16px, monospace
theme.typestyleV2CodeMedium        // 14px, monospace
theme.typestyleV2CodeSmall         // 12px, monospace
```

### Shape (Border Radius)
```typescript
theme.shapeCornerXs     // 2px     theme.shapeCornerXl     // 10px
theme.shapeCornerSm     // 4px     theme.shapeCorner2xl    // 12px
theme.shapeCornerMd     // 6px     theme.shapeCorner3xl    // 16px
theme.shapeCornerLg     // 8px     theme.shapeCorner4xl    // 24px
theme.shapeCornerFull   // 9999px (pills, avatars)
```

### Styled Components with Theme
```typescript
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';

const Container = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  padding: ${({ theme }) => (theme as StyledTheme).space600};
`;

// Typography (there is no Typography component — use styled elements)
const Title = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;
```

## Creating New Demos

### Recommended: Use App Shell Template

1. Copy `src/demos/app-shell-template.tsx`
2. Name: `src/demos/[kebab-case]-demo.tsx`, component: `[PascalCase]Demo`
3. Wire into `src/main.tsx`:
   - Add import
   - Add to `EditorType` enum
   - Add to `DEMO_ROUTES` object
   - Add `<Route>`
4. Add card to `src/demos/index-page.tsx` in `ALL_DEMO_CARDS` array
5. Confirm: demo available at `http://localhost:4201/[kebab-case]`

### Alternative: Minimal Demo (No App Shell)

```typescript
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@rippling/pebble/theme';

const MyDemo: React.FC = () => {
  const { theme } = useTheme();
  return (
    <Container theme={theme}>
      {/* Demo content */}
    </Container>
  );
};

const Container = styled.div`
  padding: ${({ theme }) => (theme as any).space600};
  background-color: ${({ theme }) => (theme as any).colorSurface};
  min-height: 100vh;
`;

export default MyDemo;
```

## Project Structure

```
src/
  demos/              # Demo pages (your work goes here)
  components/         # Reusable components (app-shell/, etc.)
  utils/              # theme.ts, animation-constants.ts, localStorage.ts
  overrides/          # Custom Pebble component overrides
  main.tsx            # Router entry point
docs/
  COMPONENT_CATALOG.md    # Quick component API reference
  TOKEN_CATALOG.md        # Design token reference
  AI_PROMPTING_GUIDE.md   # Detailed component usage guide
  guides/                 # Confluence-synced component docs
```

## Code Review Checklist

Before considering code complete:
- No hardcoded colors (use `theme.color*`)
- No hardcoded spacing (use `theme.space*`)
- No hardcoded typography (use `theme.typestyle*`)
- Icon sizes are numbers (`size={20}`, not `Icon.SIZES.M`)
- Input sub-components use their own SIZES (`Input.Text.SIZES.M`)
- Using `Tip` not `Tooltip`
- Using `Button.Icon` not `IconButton`
- Using `@/` alias for shared imports
- All interactive icons have `aria-label`
- Works in both light and dark modes

## Commands

**IMPORTANT: Always use `npm run` instead of `yarn` to run scripts.** Yarn fails with `Failed to replace env in config: ${NPM_TOKEN}` because `.npmrc` uses `${NPM_TOKEN}` for the Rippling GitHub Packages registry and yarn can't resolve it. `npm run` handles this fine.

```bash
npm run dev           # Start dev server (port 4201)
npm run build         # TypeScript check + Vite build
npm run lint          # ESLint
npm run new:demo      # Scaffold a new demo
npm run override      # Override a Pebble component
```

### Component Override Workflow

When you need to customize a Pebble component beyond what props allow:

1. **Check if props solve it first** — Don't override if standard props work
2. **Run the override:** `npm run override ComponentName`
3. **Only modify the specific files you need** — Keep changes minimal
4. **Document your changes** in the component's README.md in `src/overrides/`

## Debugging Component Issues

1. **Check the Gotchas Table** — Most common issues are covered there
2. **Consult docs** — `docs/COMPONENT_CATALOG.md` and `docs/guides/components/` have detailed API info
3. **Check existing demos** — See how similar components are used in `src/demos/`
4. **Verify props with TypeScript** — Let the type system catch mistakes

## Deeper Reference

For complex component APIs or unfamiliar components, consult:
- `docs/COMPONENT_CATALOG.md` — quick component reference with gotchas
- `docs/TOKEN_CATALOG.md` — full design token catalog
- `docs/AI_PROMPTING_GUIDE.md` — detailed component usage patterns
- `docs/guides/components/` — comprehensive Confluence-synced docs
- Pebble Storybook: https://pebble.rippling.dev
