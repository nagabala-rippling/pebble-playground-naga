# Pebble Playground

**A shared sandbox for prototyping with AI and Rippling's design system.**

Describe what you want to build, and AI makes it real — using actual Pebble components, not generic placeholders. Prototypes match production from the start. Works with Claude Code, Cursor, or any AI coding assistant.

Build interactive mockups (modals, forms, dashboards), test micro-interactions, or explore layout ideas. Since everything uses Pebble's actual components and design tokens, what you build can be handed off to engineering without translation.

![Pebble Playground Homepage](docs/images/playground-homepage.png)

---

## Getting Started

### 1. Prerequisites

- **Node.js** >= 18
- **An AI coding tool** — Claude Code (recommended), Cursor, or similar
- **GitHub Packages access** — you need an `NPM_TOKEN` to install `@rippling/pebble`. See [GitHub Packages Access](#github-packages-access) below.

### 2. Clone the repo

```bash
git clone https://github.com/Rippling/prototyping-playground.git
cd prototyping-playground
```

### 3. Install and run

```bash
npm install
npm run dev
```

The playground opens at **http://localhost:4201** with a personalized greeting.

> **Note:** Running `npm install` automatically sets up the **Pebble MCP** (Model Context Protocol) server. This gives AI coding tools direct access to Pebble component documentation, props, and examples. If using Cursor, restart it after install to activate the MCP.

### 4. Create your branch and start building

```bash
git checkout -b proto/yourname/my-first-demo
```

Open the project in your AI coding tool and start chatting. Try this:

> *"Create a new demo called 'Employee Directory' by copying app-shell-template.tsx. Show a list of employees with avatars, names, and job titles. Use Pebble components."*

AI creates the file, wires it up, and you'll see it live at the URL.

> **Where are my demos?** Your demo files live in `src/demos/`. That's where AI creates new demos and where you'll find examples to learn from.

**Need help?** See the detailed [Setup Guide](./SETUP_GUIDE.md) for troubleshooting.

---

## Branching & Collaboration

This is a shared repo — everyone works in branches instead of forks.

### Branch naming convention

| Branch pattern | Purpose | Merges to main? |
|---|---|---|
| `main` | Stable, reviewed, deployed to production URL | — |
| `feature/<name>` | Changes to the playground infrastructure or tooling | Yes, via PR |
| `docs/<name>` | Documentation updates | Yes, via PR |
| `proto/<username>/<name>` | Personal prototyping sandboxes | No |

### How it works

- **`main`** is protected — all changes go through PRs with code review.
- **`proto/` branches are your personal sandbox.** Create as many as you want (`proto/sarah/employee-dir`, `proto/venky/onboarding-flow`). They never need to merge to main — they exist for prototyping and getting Vercel preview URLs.
- **`feature/` and `docs/` branches** are for changes that improve the playground for everyone. Open a PR when ready.

### Your daily workflow

```bash
# Create a prototyping branch
git checkout main
git pull
git checkout -b proto/yourname/my-experiment

# Build your demo, commit as you go
git add .
git commit -m "Add employee directory demo"
git push -u origin proto/yourname/my-experiment

# Vercel automatically deploys a preview URL for your branch
```

### Promoting work to main

If you build something valuable that everyone should have (a reusable demo, a pattern, a fix):

1. Create a `feature/` branch from `main`
2. Add your work there
3. Open a PR — it will be reviewed before merging

---

## Sharing Your Work

### Deploy to Vercel (shareable URL)

To share a working prototype with anyone, deploy to Vercel. Ask your AI coding tool:

> *"Build this project locally and deploy it to Vercel as a prebuilt deployment. Give me the shareable URL."*

Or run it yourself:

```bash
npx vercel build && npx vercel deploy --prebuilt
```

First time only: you'll be asked to log in to Vercel (free account works) and link the project. After that, it's one command to get a shareable URL.

> **Note:** This is a temporary workflow. We're working toward automatic preview URLs for every branch push — so eventually you'll just push and get a link without any extra steps.

### Collaborate via branches

If you want someone to work on your prototype with you, or borrow your code:

```bash
git push -u origin proto/yourname/my-demo

# Collaborator runs:
git checkout proto/yourname/my-demo
npm run dev
```

---

## How to Use With AI

This playground is designed to work seamlessly with AI coding tools — Claude Code, Cursor, or any assistant that supports MCP.

### Your Workflow

1. **Describe what you want** in natural language
   - "Add a modal with a confirmation button"
   - "Make the sidebar collapsible with an icon"
   - "Use our primary color for the header background"

2. **AI builds it** using real Pebble components
   - It checks the built-in docs for component APIs
   - Uses proper design tokens (colors, spacing, typography)
   - Follows Rippling's patterns and best practices

3. **See it live instantly** — no compile step, just refresh
   - Make changes: "Move that to the right side"
   - Iterate: "Make it bigger"
   - Refine: "Use our secondary button style"

### Tips for Better Results

- **Be specific:** "Create a card with rounded corners" → "Create a Card using Pebble's Card.Layout component"
- **Reference examples:** "Make it look like the getting-started page"
- **Ask questions:** "What Pebble components should I use for a settings form?"
- **Don't worry about code** — just describe what you want to see

---

## What's Inside

### Your Demos (`src/demos/`)

This is where your prototypes live:

- **`app-shell-template.tsx`** — The main template to copy for new demos (includes nav, sidebar, content area)
- **Other demos** — Working examples showing different Pebble patterns

**Quickest way to create a new demo:**

Ask AI: *"Create a new demo called 'Employee Directory' by copying app-shell-template.tsx"*

Or start from scratch: *"Create a simple demo showing a card with user info"*

### Pebble MCP (AI Superpower)

The **Pebble MCP** (Model Context Protocol) server is automatically configured when you run `npm install`. This gives AI assistants direct access to:

- **Live component source code** — Actual prop types and implementations
- **Storybook examples** — Working code examples for every component
- **Full component list** — Discover all available Pebble components

**Check your MCP status:**
```bash
npm run mcp:status
```

**Troubleshooting:** If your AI tool doesn't seem to know about Pebble components, make sure `npm install` completed successfully (it sets up the MCP). In Cursor, restart the app after install. In Claude Code, the MCP is picked up automatically.

### Built-in Docs (`docs/`)

AI automatically references these docs when building your prototypes:

- **Component Catalog** — Quick reference for all Pebble components
- **Token Catalog** — Colors, spacing, typography
- **Component Guides** — When to use each component and why
- **Pattern Library** — Common UI patterns (modals, forms, tables, etc.)

You don't need to read these — AI does it for you. But they're there if you want to learn.

**Pro tip:** Always use `@/` imports for shared resources (e.g., `@/utils/theme`, `@/assets/logo.svg`) so your demos work from any folder.

### Live Examples

The playground includes working examples:
- **App Shell Template** — Full Rippling app layout (nav, sidebar, content) — copy this to start new demos
- **Composition Manager** — Complex multi-view app with tables, modals, and state management
- **Getting Started** — This guide, but prettier

Click around to see what's possible!

---

## Common Questions

### GitHub Packages Access

You need an `NPM_TOKEN` (a GitHub Personal Access Token with `read:packages` scope) to install `@rippling/pebble` from GitHub Packages.

**To set it up:**

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens) → **Generate new token (classic)**
2. Give it a name (e.g., "prototyping-playground") and select the **`read:packages`** scope
3. Copy the token and add it to your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
export NPM_TOKEN=ghp_your_token_here
```

4. Reload your shell (`source ~/.zshrc`) and run `npm install`

**Alternatively**, add it to your global `~/.npmrc`:

```
//npm.pkg.github.com/:_authToken=ghp_your_token_here
```

If you already have Rippling's monorepo set up, you likely already have this configured.

### "I'm not an engineer — will this be hard?"

Not at all! You're not writing code — you're describing what you want in plain English. AI handles the technical details. Think of it like working with a really fast, really patient engineer who never sleeps.

### "What if I break something?"

You can't break anything for anyone else — you're working in your own branch. Worst case, delete the file and start over. That's what it's here for.

### "Can I share my prototypes?"

Yes! Push your branch to GitHub and share the Vercel preview URL with anyone. They can see your working prototype in the browser.

### "Do I need to learn React?"

Nope. You'll pick up patterns naturally by working with AI. Over time you'll recognize component names and props, but that's learning by doing — not required upfront.

### "What if AI uses the wrong component?"

Just tell it! Say "Use a Button instead of a link" or "That should be an Input.Text, not a textarea." AI will correct it instantly. The built-in docs help AI make better choices, but you're always in control.

### "How do I get updates when the playground improves?"

Since you're working in branches on the same repo, just rebase or merge from `main`:

```bash
git checkout proto/yourname/my-demo
git merge main
```

### "Can I delete old proto branches?"

Yes — proto branches are disposable. Clean them up whenever you want:

```bash
git push origin --delete proto/yourname/old-experiment
git branch -d proto/yourname/old-experiment
```

---

## Commands

```bash
npm run dev          # Start dev server (port 4201)
npm run build        # TypeScript check + Vite build
npm run lint         # ESLint
npm run new:demo     # Scaffold a new demo
npm run mcp:status   # Check Pebble MCP status
```

> **Important:** Always use `npm run` instead of `yarn`. Yarn fails with the `NPM_TOKEN` environment variable used for GitHub Packages access.

---

## Need Help?

- **Detailed setup:** [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Collaboration guide:** [docs/COLLABORATION.md](./docs/COLLABORATION.md)
- **Technical questions:** Check the [docs/](./docs/) folder
- **AI tips:** [docs/AI_PROMPTING_GUIDE.md](./docs/AI_PROMPTING_GUIDE.md)
- **Slack:** #ask-web-design-system

---

## Why Use This vs Other Tools

Generic AI prototyping tools (v0, shadcn) use placeholder components that don't match Rippling's design system. This playground uses Pebble directly, so prototypes look and behave like production from the start. No translation needed when handing off to engineering.

---

## Ready to Build?

```bash
npm run dev
```

Open **http://localhost:4201** and start chatting with your AI coding tool.

Try this first prompt: *"Create a new demo showing a simple employee profile card with an avatar, name, title, and edit button. Use Pebble components."*
