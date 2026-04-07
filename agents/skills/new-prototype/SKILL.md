---
name: new-prototype
description: >-
  Add a new prototype to the current playground. Use when the user says "new
  prototype", "create a prototype", "add a demo", "build me a...", or describes
  a UI they want to build.
---

# New Prototype

Scaffolds a new prototype (demo page) on the current branch — creates the
file, wires routing, and registers it on the index page.

This skill does NOT create a branch. If the user needs a new playground
(branch), use the **new-playground** skill first.

## Prerequisites

- Must be in the `prototyping-playground` project directory
- Node modules installed (`npm install`)
- Should be on a `proto/` branch (warn if on `main`, but don't block)

## Workflow

### Step 1: Determine prototype name

Ask the user what they want to build if they haven't said. Derive:

- **Display name:** e.g. "Benefits Dashboard"
- **Kebab slug:** e.g. `benefits-dashboard`
- **PascalCase component:** e.g. `BenefitsDashboardDemo`

### Step 2: Check branch

Check the current branch:

```bash
git branch --show-current
```

- **On a `proto/` branch:** Good, continue.
- **On `main`:** Warn the user: "You're on main — want me to create a
  playground branch first?" If yes, hand off to the **new-playground** skill.
  If they want to continue on main anyway, proceed.
- **On another branch:** Proceed (they may be adding to an existing feature
  branch).

### Step 3: Create the demo file

Copy `src/demos/app-shell-template.tsx` to `src/demos/<slug>-demo.tsx`.

In the new file:
- Rename the component from `AppShellTemplate` to `<PascalCase>Demo`
- Update the description comment to reflect what the prototype is about

### Step 4: Wire up routing

Edit `src/main.tsx`:

1. Add import:
   ```typescript
   import <PascalCase>Demo from './demos/<slug>-demo';
   ```

2. Add to `EditorType` enum:
   ```typescript
   <UPPER_SNAKE> = '<slug>',
   ```

3. Add to `DEMO_ROUTES` object:
   ```typescript
   [EditorType.<UPPER_SNAKE>]: <PascalCase>Demo,
   ```

4. Add `<Route>`:
   ```typescript
   <Route path="<slug>" element={<<PascalCase>Demo />} />
   ```

### Step 5: Register on the index page

Edit `src/demos/index-page.tsx`. Add an entry to the `ALL_DEMOS` array:

```typescript
{
  title: '<Display Name>',
  description: '<Brief description of what this prototype explores.>',
  path: '/<slug>',
  icon: Icon.TYPES.<APPROPRIATE_ICON>,
  category: 'prototype',
},
```

Choose an icon that relates to the prototype's subject. Verify the icon exists:

```bash
grep '<ICON_NAME>' node_modules/@rippling/pebble/Icon/Icon.constants.d.ts
```

### Step 6: Typecheck

```bash
npm run typecheck
```

Fix any errors before proceeding.

### Step 7: Verify locally

Confirm the dev server is running (`npm run dev`) and the prototype loads at:

```
http://localhost:4201/<slug>
```

### Step 8: Report back

Tell the user their prototype is ready:

```
Your prototype "<Display Name>" is ready at http://localhost:4201/<slug>.

Describe what you want to see and I'll build it out. When you're ready to
share, just say "deploy" to get a shareable link.
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Icon not found in build | Verify with `grep` in `Icon.constants.d.ts` before using |
| Route not loading | Check `main.tsx` — import, enum, DEMO_ROUTES, and Route must all be added |
| Page shows but is blank | Check browser console for errors; likely a missing import in the demo file |
| On `main` branch | Suggest creating a playground first with the new-playground skill |
