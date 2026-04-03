---
name: new-prototype
description: >-
  Create a new prototype in the playground. Use when the user says "new
  prototype", "create a prototype", "create a new demo", "start a new demo",
  or wants to build something new.
---

# New Prototype

Creates a new prototype with proper branching, file scaffolding, routing, and
index page registration.

## Prerequisites

- Must be in the `prototyping-playground` project directory
- Node modules installed (`npm install`)

## Workflow

### Step 1: Determine prototype name and branch

Ask the user what they want to build if they haven't said. Derive:

- **Display name:** e.g. "Benefits Dashboard"
- **Kebab slug:** e.g. `benefits-dashboard`
- **PascalCase component:** e.g. `BenefitsDashboardDemo`
- **Branch name:** `proto/<user>/<slug>`

For the `<user>` segment, use the git user's first name (lowercase):

```bash
git config user.name
```

Take the first name, lowercase it. Example: "Paul Best" → `paul`.

Branch name example: `proto/paul/benefits-dashboard`

### Step 2: Create the branch

Check current branch. If already on a `proto/` branch for this user, you can
continue on it. Otherwise, create a new branch from the current branch:

```bash
git checkout -b proto/<user>/<slug>
```

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
Your prototype "<Display Name>" is set up on branch proto/<user>/<slug>.

Open http://localhost:4201/<slug> to see it.

Describe what you want to see and I'll build it out. When you're ready to
share, just say "deploy my playground" to get a shareable link.
```

## Branch naming convention

All prototypes live on branches prefixed with `proto/`:

```
proto/<user>/<slug>
```

- `<user>` — first name of the creator, lowercase (e.g. `paul`, `sarah`)
- `<slug>` — kebab-case short name for the prototype (e.g. `benefits-dashboard`, `onboarding-flow`)

Examples:
- `proto/paul/benefits-dashboard`
- `proto/sarah/onboarding-flow`
- `proto/alex/spend-recipes`

This keeps branches organized and makes it clear who owns each prototype.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Icon not found in build | Verify with `grep` in `Icon.constants.d.ts` before using |
| Route not loading | Check `main.tsx` — import, enum, DEMO_ROUTES, and Route must all be added |
| Page shows but is blank | Check browser console for errors; likely a missing import in the demo file |
| Branch name conflict | If branch exists, either check it out or pick a different slug |
