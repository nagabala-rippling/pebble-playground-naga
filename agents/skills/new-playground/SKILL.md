---
name: new-playground
description: >-
  Create a new playground (branch) for prototyping. Use when the user says "new
  playground", "new workspace", "start a playground", "set up a workspace", or
  wants a fresh branch to build prototypes on.
---

# New Playground

Creates a new playground branch where the user can build one or more prototypes.
A playground is a branch — each branch gets its own deploy URL when pushed.

## Prerequisites

- Must be in the `prototyping-playground` project directory
- Node modules installed (`npm install`)

## Workflow

### Step 1: Determine playground name

Ask the user what they want to call their playground if they haven't said.
If they've described a specific prototype instead (e.g. "build me a benefits
dashboard"), use that as the playground name — you'll scaffold the first demo
too.

Derive:

- **Playground name:** e.g. "Q2 Explorations", "Benefits Redesign"
- **Kebab slug:** e.g. `q2-explorations`, `benefits-redesign`

For the `<user>` segment, use the git user's first name (lowercase):

```bash
git config user.name
```

Take the first name, lowercase it. Example: "Paul Best" → `paul`.

Branch name: `proto/<user>/<slug>`

Examples:
- `proto/paul/q2-explorations`
- `proto/sarah/benefits-redesign`
- `proto/alex/onboarding-rethink`

### Step 2: Create the branch

Check the current branch first:

- **If already on a `proto/` branch for this user:** Ask if they want to
  continue on it or start fresh. If continuing, skip to reporting back.
- **If on `main` or another branch:** Create the new branch from `main`:

```bash
git checkout main
git pull origin main
git checkout -b proto/<user>/<slug>
```

### Step 3: (Optional) Scaffold the first demo

If the user described a specific prototype they want to build, run the
**new-prototype** skill workflow (Steps 1–7 from
`agents/skills/new-prototype/SKILL.md`) to scaffold the first demo file.

If they just want an empty playground, skip this step.

### Step 4: Report back

Tell the user their playground is ready:

```
Your playground is set up on branch proto/<user>/<slug>.

<If a demo was scaffolded>
Your first prototype "<Demo Name>" is at http://localhost:4201/<demo-slug>.
</If>

You can add more prototypes anytime — just say "new prototype" or describe
what you want to build. When you're ready to share, say "deploy".
```

## Branch naming convention

All playgrounds live on branches prefixed with `proto/`:

```
proto/<user>/<slug>
```

- `<user>` — first name of the creator, lowercase (e.g. `paul`, `sarah`)
- `<slug>` — kebab-case name for the playground (e.g. `q2-explorations`,
  `benefits-redesign`)

A playground can contain multiple prototypes (demo files). Each prototype is
a separate page in the app, all sharing the same branch and deploy URL.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Branch name conflict | If branch exists, ask the user to pick a different name or check it out |
| Want to switch playgrounds | `git checkout proto/<user>/<other-slug>` |
| Need to start over | Create a new branch from `main` |
