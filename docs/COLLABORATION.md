# Collaboration Guide

How to work with the Pebble Playground — solo, with teammates, and across the team.

---

## How We Work: Branches, Not Forks

Everyone works in the same repo (`Rippling/pebble-playground`) using branches. This keeps things simple — no fork management, no upstream syncing, and Vercel preview deployments work automatically for every branch.

### Branch convention

| Branch                    | Purpose                                        | Merges to main? |
| ------------------------- | ---------------------------------------------- | --------------- |
| `main`                    | Stable, reviewed                               | —               |
| `feature/<name>`          | Playground infrastructure/tooling improvements | Yes, via PR     |
| `docs/<name>`             | Documentation updates                          | Yes, via PR     |
| `proto/<username>/<name>` | Personal prototyping                           | No              |

**Proto branches are your sandbox.** Create as many as you want. They don't need review, they don't merge to main, and you can delete them when you're done.

---

## Working Solo

### Daily workflow

```bash
# Create a branch for your work
git checkout main && git pull
git checkout -b proto/yourname/my-experiment

# Build demos, iterate, commit as you go
git add .
git commit -m "Add employee directory demo"
git push -u origin proto/yourname/my-experiment

# Vercel gives you a preview URL automatically
```

### Getting updates from main

When the playground gets improvements (new templates, fixes, docs):

```bash
git checkout proto/yourname/my-demo
git merge main
# Resolve any conflicts, continue working
```

### Cleaning up old branches

```bash
# Delete a branch you're done with
git push origin --delete proto/yourname/old-experiment
git branch -d proto/yourname/old-experiment
```

---

## Working With Your Team

### Option A: Shared proto branch

For close collaboration on a single prototype:

```bash
# One person creates the branch
git checkout -b proto/team-name/dashboard-redesign
git push -u origin proto/team-name/dashboard-redesign

# Others check it out
git checkout proto/team-name/dashboard-redesign
```

Coordinate pushes to avoid conflicts, or use short-lived sub-branches if needed.

### Option B: Separate branches, share locally

Each person works in their own `proto/` branch. Share by having teammates check out your branch and run `npm run dev`. Copy ideas you like into your own branch.

### Sharing demos

- **Locally:** Have teammates `git checkout` your branch and run `npm run dev`
- **Via URL:** Deploy to Vercel (see below) and share the link
- **Permanently:** Open a PR to promote your demo to `main`

---

## Deploying to Vercel

To share a working prototype with anyone via URL, deploy to Vercel. Ask your AI coding tool:

> _"Build this project locally and deploy it to Vercel as a prebuilt deployment. Give me the shareable URL."_

Or run it yourself:

```bash
npx vercel build && npx vercel deploy --prebuilt
```

First time only: you'll be asked to log in to Vercel (free account works) and link the project. After that, it's one command to get a URL.

> **Note:** This is a temporary workflow. We're working toward automatic preview URLs for every branch push — so eventually you'll just push your branch and get a link without any extra steps.

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
