---
name: deploy-playground
description: >-
  Deploy the playground and get a shareable preview URL. Use when the user says
  "deploy", "share", "get preview URL", "publish", or wants a shareable link
  to their playground.
---

# Deploy Playground

Commits, pushes, and deploys the playground to Vercel via GitHub Actions, then
retrieves the shareable preview URL.

## Prerequisites

- Must be on a feature branch (not `main`)
- GitHub CLI (`gh`) must be authenticated
- Changes must be committed or ready to commit

## Workflow

### Step 1: Typecheck

Run the TypeScript compiler to catch errors before pushing. Vite's dev server
skips type-checking, so errors like invalid `Icon.TYPES.*` names only surface
in CI builds. Catch them early:

```bash
npm run typecheck
```

If there are errors, fix them before proceeding. Common issues:
- Invalid `Icon.TYPES.*` — grep `Icon.constants.d.ts` for the correct name
- Unused imports — remove them

### Step 2: Commit and push

Check for uncommitted changes. If there are any, commit them with a descriptive
message and push:

```bash
git add -A
git commit -m "descriptive message about changes"
git push -u origin HEAD
```

If already up to date with remote, skip to Step 3.

### Step 3: Wait for deploy

The push triggers `.github/workflows/preview.yml`. Monitor it:

```bash
gh run list --workflow=preview.yml --branch="$(git branch --show-current)" -L1
```

Poll every 15-30s until `status` is `completed`. Typical build takes ~90 seconds.

If the run fails, check logs with:
```bash
gh run view <run-id> --log
```

### Step 4: Fetch preview URL

Once the deploy succeeds:

```bash
npm run preview-url
```

This fetches the deployed URL from GitHub Actions logs and saves it to
`.env.local`. If the Vite dev server is running, it auto-restarts and the
index page updates to show "Preview URL ready" with a copy button.

### Step 5: Report back

Tell the user their preview URL. Format:

```
Your playground is deployed and shareable:
<URL>

The index page now shows "Preview URL ready" — use the copy button to share.
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `gh: command not found` | Install GitHub CLI: `brew install gh` then `gh auth login` |
| Deploy fails | Check logs: `gh run view <id> --log` — usually a TypeScript error |
| URL not updating locally | Run `npm run preview-url` manually, Vite auto-restarts on `.env.local` change |
| Branch not deploying | Workflow only triggers on push to non-`main` branches |
