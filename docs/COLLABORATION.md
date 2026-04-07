# Collaboration Guide

How to work with the Pebble Playground — solo, with teammates, and across the team.

---

## Quick Start: AI-Assisted Workflow

The fastest way to get started is with your AI coding tool (Cursor, Claude Code, etc.). Three commands cover the full lifecycle:

| What you want | What to say | What happens |
| --- | --- | --- |
| **Start a new playground** | "new playground" or "new workspace" | Creates a `proto/<you>/<name>` branch from main |
| **Add a prototype** | "new prototype" or "build me a benefits dashboard" | Scaffolds a demo file, wires routing, registers on index page |
| **Deploy and share** | "deploy" or "share my playground" | Pushes, triggers CI, returns a shareable Vercel URL |

### Example session

```
You: "Start a new playground for Q2 explorations"
AI:  → Creates branch proto/paul/q2-explorations

You: "Build me a benefits dashboard"
AI:  → Scaffolds benefits-dashboard-demo.tsx, wires routing
     → http://localhost:4201/benefits-dashboard

You: "Add an onboarding flow prototype too"
AI:  → Scaffolds onboarding-flow-demo.tsx on the same branch
     → http://localhost:4201/onboarding-flow

You: "Deploy"
AI:  → Pushes, waits for CI, returns URL
     → https://prototyping-playground-a1b2c3d4-rippling.vercel.app
```

One branch, multiple prototypes, one deploy URL. Share it with anyone.

---

## How We Work: Branches, Not Forks

Everyone works in the same repo (`Rippling/prototyping-playground`) using branches. This keeps things simple — no fork management, no upstream syncing, and Vercel preview deployments work automatically for every branch.

### Branch convention

| Branch | Purpose | Merges to main? |
| --- | --- | --- |
| `main` | Stable, reviewed | — |
| `feature/<name>` | Playground infrastructure/tooling improvements | Yes, via PR |
| `docs/<name>` | Documentation updates | Yes, via PR |
| `proto/<user>/<name>` | Personal playground (one or more prototypes) | No |

**Proto branches are your sandbox.** Create as many as you want. They don't need review, they don't merge to main, and you can delete them when you're done.

### Playground vs. Prototype

- A **playground** is a branch (`proto/paul/q2-explorations`). It gets its own deploy URL.
- A **prototype** is a demo file within that branch (`benefits-dashboard-demo.tsx`). Multiple prototypes can live in the same playground.

---

## Creating a Playground

### With AI (recommended)

Say "new playground" or "new workspace". The AI will:
1. Ask what to call it
2. Create a `proto/<you>/<name>` branch from main
3. Optionally scaffold your first prototype

### Manually

```bash
git checkout main && git pull
git checkout -b proto/yourname/my-playground
```

---

## Adding Prototypes

### With AI (recommended)

Say "new prototype" or describe what you want ("build me a benefits dashboard"). The AI will:
1. Scaffold the demo file from the app shell template
2. Wire up routing in `main.tsx`
3. Register it on the index page
4. Typecheck and verify it loads

### Manually

1. Copy `src/demos/app-shell-template.tsx` → `src/demos/<slug>-demo.tsx`
2. Rename the component, update the description
3. Add the route in `src/main.tsx` (import, enum, DEMO_ROUTES, Route)
4. Add the card in `src/demos/index-page.tsx`
5. Run `npm run typecheck`

### With the scaffolding script

```bash
npm run new:demo
```

---

## Deploying and Sharing

### With AI (recommended)

Say "deploy" or "share my playground". The AI will:
1. Typecheck your code
2. Commit and push
3. Wait for the GitHub Actions deploy (~90 seconds)
4. Fetch the real Vercel URL and save it to `.env.local`
5. Give you the shareable link

### Manually

```bash
# Push to trigger the deploy
git push -u origin HEAD

# Wait for the GitHub Actions workflow to complete, then:
npm run preview-url

# The URL is saved to .env.local and printed to the console
```

The deploy workflow (`preview.yml`) runs on every push to a non-main branch. It builds and deploys to Vercel, then posts the URL as a PR comment if one exists.

---

## Working Solo

### Daily workflow

```bash
# Start a new playground (or switch to an existing one)
git checkout proto/yourname/my-playground

# Build demos, iterate, commit as you go
git add .
git commit -m "Add employee directory demo"
git push

# Get the preview URL
npm run preview-url
```

### Getting updates from main

When the playground gets improvements (new templates, fixes, docs):

```bash
git checkout proto/yourname/my-playground
git merge main
# Resolve any conflicts, continue working
```

### Cleaning up old branches

```bash
git push origin --delete proto/yourname/old-experiment
git branch -d proto/yourname/old-experiment
```

---

## Working With Your Team

### Option A: Shared playground branch

For close collaboration on a set of prototypes:

```bash
# One person creates the playground
git checkout -b proto/team-name/dashboard-redesign
git push -u origin proto/team-name/dashboard-redesign

# Others check it out
git checkout proto/team-name/dashboard-redesign
```

Coordinate pushes to avoid conflicts, or use short-lived sub-branches if needed.

### Option B: Separate playgrounds, share links

Each person works in their own `proto/` branch. Share via deploy URLs. Copy ideas you like into your own playground.

### Sharing demos

- **Locally:** Have teammates `git checkout` your branch and run `npm run dev`
- **Via URL:** Deploy and share the Vercel link (say "deploy" to your AI tool)
- **Permanently:** Open a PR to promote your demo to `main`

---

## Contributing to the Playground

If you build something that improves the playground for everyone — a useful demo, a bug fix, better docs — contribute it back to `main`.

### What to contribute

- New demo patterns others would find useful
- Documentation improvements
- Bug fixes in the playground infrastructure
- Component rendering fixes or AI guidance updates

### How to contribute

```bash
# Create a feature branch from main
git checkout main && git pull
git checkout -b feature/add-data-table-demo

# Make your changes, then push and open a PR
git push -u origin feature/add-data-table-demo
```

Open a PR on GitHub. It will be reviewed before merging.

### Fixing component issues

When you find that AI generates incorrect component code, fix it and contribute back:

1. Update `AGENTS.md` (add to the gotchas table)
2. Update docs if needed
3. Open a PR describing the issue and fix

Every fix makes AI smarter for everyone using the playground.

---

## Tips for Clean Collaboration

### Keep your demos isolated

- Put demos in `src/demos/` (not in core infrastructure files)
- Avoid modifying `main.tsx` more than necessary for your proto work
- Use the `@/` import alias so paths stay clean

### When merge conflicts happen

Most conflicts will be in:

- `src/main.tsx` — if you added routes
- `src/demos/index-page.tsx` — if you added demo cards
- `AGENTS.md` — if you added custom rules

**Resolution strategy:**

1. Keep your additions (new demos, new routes)
2. Accept upstream changes to infrastructure
3. Manually merge if both sides changed the same section

### Starting fresh

If your branch gets too messy:

1. Note which demo files you want to keep
2. Create a fresh branch from `main`
3. Copy your demo files back in

Your demo files are the valuable part — the infrastructure can always be re-pulled from main.

---

## Questions?

- **Slack:** #ask-web-design-system
- **Issues:** Open an issue on the repo
- **Docs:** Check the `docs/` folder for more guides
