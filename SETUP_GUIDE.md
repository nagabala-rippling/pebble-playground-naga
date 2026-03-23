# Pebble Playground Setup Guide

Detailed setup instructions and troubleshooting for the Pebble Playground.

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** (comes with Node.js)
- **Git**
- **NPM_TOKEN** — a GitHub Personal Access Token for installing `@rippling/pebble` from GitHub Packages

## Step 1: GitHub Packages Access

The `@rippling/pebble` packages are hosted on GitHub Packages. You need a Personal Access Token (PAT) with `read:packages` scope.

### Create a token

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Name it (e.g., "pebble-packages"), set an expiration, and select the **`read:packages`** scope
4. Copy the token

### Configure the token

**Option A: Environment variable (recommended)**

Add to your `~/.zshrc` (or `~/.bashrc`):

```bash
export NPM_TOKEN=ghp_your_token_here
```

Then reload: `source ~/.zshrc`

**Option B: Global `.npmrc`**

Add to `~/.npmrc`:

```
@rippling:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=ghp_your_token_here
```

### Already have access?

If you work in Rippling's monorepo, you likely already have a token configured in your global `~/.npmrc`. Check with:

```bash
cat ~/.npmrc | grep npm.pkg.github.com
```

If you see a line with `_authToken`, you're good to go.

## Step 2: Clone and Install

```bash
git clone https://github.com/Rippling/pebble-playground.git
cd pebble-playground
npm install
```

## Step 3: Run the Dev Server

```bash
npm run dev
```

The playground will be available at **http://localhost:4201**.

On first run, the setup script automatically configures your workspace from your git config:

- Reads your name from `git config user.name`
- Reads your email from `git config user.email`
- Generates a Gravatar URL from your email
- Detects your GitHub username from your git remote
- Creates a `.env.local` file with your preferences

Your homepage will display a personalized greeting with your avatar.

### Optional: GitHub Avatar

For a GitHub avatar instead of Gravatar, set your GitHub username:

```bash
git config --global github.user "your-github-username"
npm run setup:user
```

## Step 4: Create Your Branch

```bash
git checkout -b proto/yourname/my-first-demo
```

See the [README](./README.md#branching--collaboration) for the full branching convention.

## Step 5: Verify Setup

Open http://localhost:4201 in your browser. You should see:

- Your personalized greeting with your avatar
- A collection of demo cards on the index page
- Theme toggle (light/dark berry themes)
- Working demo pages when you click into them

## Commands

```bash
npm run dev          # Start dev server (port 4201)
npm run build        # TypeScript check + Vite build
npm run lint         # ESLint
npm run format       # Prettier formatting
npm run new:demo     # Scaffold a new demo interactively
npm run new:shell    # Scaffold a demo with the app shell template
npm run mcp:status   # Check Pebble MCP server status
npm run override     # Override a Pebble component for customization
```

> **Important:** Always use `npm run` instead of `yarn`. Yarn fails because `.npmrc` references `${NPM_TOKEN}` and yarn can't resolve it.

## Troubleshooting

### `npm install` fails with 401 Unauthorized

Your `NPM_TOKEN` is missing or expired.

```
npm error 401 Unauthorized - GET https://npm.pkg.github.com/@rippling%2fpebble
```

**Fix:** Follow [Step 1](#step-1-github-packages-access) to set up your token. If you already have one, it may have expired — generate a new one.

### `npm install` fails with peer dependency conflict

If you see `ERESOLVE could not resolve` errors about React versions:

```bash
npm install --legacy-peer-deps
```

The project pins `react@18.2.0` to match `@rippling/pebble`'s peer dependency. If the lockfile gets out of sync, `--legacy-peer-deps` will work around it.

### "Cannot find module '@rippling/pebble'"

Dependencies aren't installed. Run `npm install` and make sure it completes without errors.

### Port 4201 is already in use

Vite will automatically pick the next available port and tell you in the terminal output. Look for:

```
Port 4201 is in use, trying another one...
  ➜  Local:   http://localhost:4202/
```

### Pebble MCP not working

1. Make sure `npm install` completed (the postinstall script sets up the MCP)
2. In Cursor: restart the app completely (not just reload window)
3. In Claude Code: the MCP should be picked up automatically from the project config
4. Check status: `npm run mcp:status`
5. If still not working, re-run setup: `npm run mcp:setup`

### TypeScript errors about missing types

```bash
npm install -D @types/react @types/react-dom @types/lodash @types/node
```

## File Structure

```
pebble-playground/
├── src/
│   ├── demos/              # Demo pages (your work goes here)
│   ├── components/         # Reusable components (app-shell/, etc.)
│   ├── utils/              # theme.ts, animation-constants.ts, localStorage.ts
│   ├── overrides/          # Custom Pebble component overrides
│   └── main.tsx            # Router entry point
├── docs/                   # Documentation and guides
├── scripts/                # Helper scripts
├── AGENTS.md            # AI assistant rules (primary reference)
├── CLAUDE.md               # AI assistant rules (compact version)
└── package.json            # Dependencies and scripts
```

## Questions?

- See [README.md](./README.md) for general usage
- See [docs/](./docs/) for detailed guides
- Slack: #ask-web-design-system
