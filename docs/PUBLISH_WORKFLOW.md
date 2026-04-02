# Pebble Playground: Publish & Collaboration Workflow (MVP)

> **Note:** This document was written for an earlier fork-based model. The repo now lives at `Rippling/prototyping-playground` and uses a **branch-based workflow** instead of forks. See the [README](../README.md) and [Collaboration Guide](./COLLABORATION.md) for the current workflow. Some ideas below (folder structure, demo filtering, promotion flow) are still relevant for future implementation.

## Overview

This document outlines the deployment and collaboration strategy for Pebble Playground, designed to enable both designers and developers to create, share, and showcase demos without cluttering each other's workspaces.

**Status:** 📝 Proposal (Partially Superseded — branching model replaced forks)  
**Target Audience:** Designers and developers using Pebble

---

## 🎯 The Problem We're Solving

### Current Challenges
- **Isolation:** Devs/designers want to create demos without cluttering others' workspaces
- **Sharing:** Need an easy way to share specific demos with colleagues
- **Accessibility:** Non-technical designers need simple deployment (no complex DevOps)
- **Discovery:** Should be easy to distinguish "official" curated demos vs. personal experiments
- **Privacy:** Designers need a safe space to experiment without judgment

### Success Criteria
- ✅ Anyone can deploy their own instance in < 5 minutes (one button click)
- ✅ Designers can create demos without Git/deployment expertise
- ✅ Personal experiments stay private until ready to share
- ✅ Easy to browse others' work for inspiration
- ✅ Clear path from experiment → personal → team → official

---

## 🏗️ Proposed Architecture

### High-Level Design

```
Main Repo (github.com/rippling/prototyping-playground)
├── Official demos (blessed, vetted examples)
├── Team demos (collaborative work-in-progress)
├── Personal demos (@username folders - shareable experiments)
└── Private demos (gitignored - local only)

Personal Vercel Deployments
├── Each person deploys their own instance (one-click)
├── Vercel auto-configures everything
├── Share links: https://[your-name]-prototyping-playground.vercel.app/your-demo
```

### Folder Structure

```
src/demos/
├── official/                    # 🏆 Blessed starter templates
│   ├── app-shell-demo.tsx       # Canonical app shell
│   ├── design-tokens-demo.tsx   # Token showcase
│   └── README.md
│
├── team/                        # 🤝 Collaborative team work
│   ├── employee-directory.tsx   # Multi-person projects
│   ├── data-table-patterns.tsx  # Team explorations
│   └── README.md
│
├── @paul/                       # 👤 Personal shareable demos
│   ├── autocomplete-demo.tsx
│   └── README.md
│
├── @sarah/                      # 👤 Personal shareable demos
│   ├── charts-prototype.tsx
│   └── README.md
│
└── private/                     # 🔒 Gitignored - experiments only
    ├── messy-wip.tsx            # True scratch work
    └── README.md
```

### What Gets Committed to Git?

```bash
# ✅ COMMITTED (shared with team)
src/demos/official/
src/demos/team/
src/demos/@paul/
src/demos/@sarah/
# ... all @username folders

# ❌ GITIGNORED (local only)
src/demos/private/
```

---

## 📂 Folder Purpose & Guidelines

### 🏆 `official/` - Blessed Starter Templates

**Purpose:** The "golden path" examples that set the standard

**What goes here:**
- ✅ App shell template (for copying to start new demos)
- ✅ Design tokens showcase (educational reference)
- ✅ Component catalog examples (best practices)
- ✅ Pattern library demos (approved UX patterns)

**Quality Bar:**
- Must be documented with clear comments
- Code is exemplary (clean structure, follows best practices)
- Showcases proper Pebble usage
- Team consensus that "this is how we do it"

**Who Decides:** Team vote or design system lead approval

**Example Demos:**
- `app-shell-demo.tsx` - Complete app layout template
- `design-tokens-demo.tsx` - Token usage showcase
- `form-patterns-demo.tsx` - Form best practices

---

### 🤝 `team/` - Collaborative Work-in-Progress

**Purpose:** Team experiments, works-in-progress, ideas being explored together

**What goes here:**
- ✅ Multi-person projects ("Let's figure out data tables together")
- ✅ Design critiques ("Exploring 3 approaches to filtering")
- ✅ Client demos ("Mockup for Product team review")
- ✅ Pattern explorations ("Trying out different loading states")

**Quality Bar:**
- Working (doesn't have to be pretty)
- Documented intent ("This explores X approach vs Y approach")
- Open for feedback and iteration

**Who Decides:** Anyone can add, team can comment/iterate

**Example Demos:**
- `employee-directory-wip.tsx` - Team building this together
- `advanced-search-exploration.tsx` - Trying different patterns
- `client-dashboard-mockup.tsx` - For stakeholder review

---

### 👤 `@username/` - Personal Shareable Demos

**Purpose:** Individual explorations that others can browse and learn from

**What goes here:**
- ✅ Your experiments that work
- ✅ Component explorations you're proud of
- ✅ Ideas you want feedback on
- ✅ Demos for your own projects

**Quality Bar:**
- Runs without errors
- Basic explanation of what it does (comment at top of file)

**Who Decides:** You own your folder

**Naming Convention:** Use `@` prefix to clearly mark personal namespaces (familiar from GitHub/npm)

**Example Demos:**
- `@paul/autocomplete-advanced.tsx`
- `@sarah/data-visualization.tsx`
- `@nick/keyboard-navigation.tsx`

---

### 🔒 `private/` - Your Scratch Pad

**Purpose:** Messy experimentation, broken code, learning (local only, never committed)

**What goes here:**
- ✅ First attempts that don't work yet
- ✅ Copy-pasted code you're learning from
- ✅ "I have no idea what I'm doing" explorations
- ✅ Half-finished ideas

**Quality Bar:** None! Break things, experiment freely!

**Who Decides:** You (nobody else sees it - it's gitignored)

**Example Demos:**
- `private/trying-animations.tsx`
- `private/broken-table-thing.tsx`
- `private/learning-forms.tsx`

---

## 🚀 Implementation Steps

### Step 1: Update .gitignore (2 minutes)

Add to `.gitignore`:

```bash
# Private demos - never committed
src/demos/private/
```

### Step 2: Create Folder Structure (5 minutes)

```bash
# Create folders
mkdir -p src/demos/official
mkdir -p src/demos/team
mkdir -p src/demos/private

# Move existing demos to official
git mv src/demos/app-shell-demo.tsx src/demos/official/
git mv src/demos/design-tokens-demo.tsx src/demos/official/
git mv src/demos/modal-demo.tsx src/demos/official/
git mv src/demos/animations-demo.tsx src/demos/official/

# Create READMEs
touch src/demos/official/README.md
touch src/demos/team/README.md
touch src/demos/private/README.md
```

### Step 3: Add Demo Filtering Logic (1 hour)

Update `src/main.tsx` to respect `VITE_SHOW_DEMOS` environment variable:

```typescript
// src/main.tsx

// Get which demo folders to show from env var
const showDemos = (import.meta.env.VITE_SHOW_DEMOS || 'official').split(',');

// Filter DEMO_CARDS based on showDemos
const VISIBLE_DEMO_CARDS = DEMO_CARDS.filter(card => {
  // Extract folder from path: '/team/demo' -> 'team'
  const folder = card.path.split('/')[1];
  return showDemos.includes(folder) || showDemos.includes('all');
});

// Use VISIBLE_DEMO_CARDS in your index page
```

### Step 4: Update README with Deploy Button (15 minutes)

Add to `README.md`:

```markdown
## 🚀 Deploy Your Own Playground

Each team member can have their own deployment for personal demos:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rippling/prototyping-playground&env=VITE_SHOW_DEMOS&envDescription=Which%20demo%20folders%20to%20show&envLink=https://github.com/rippling/prototyping-playground/blob/main/docs/PUBLISH_WORKFLOW.md)

### Quick Setup (2 minutes)
1. Click the "Deploy with Vercel" button above
2. Vercel will clone the repo and deploy automatically
3. Set environment variable: `VITE_SHOW_DEMOS=official,team,@yourname`
4. Your playground will be live at `https://your-name-prototyping-playground.vercel.app`
5. All commits to your repo auto-deploy ✨

### For Designers (No Vercel Experience Required)
1. Click the deploy button - Vercel walks you through account creation
2. After deploy, go to your project settings → Environment Variables
3. Add: `VITE_SHOW_DEMOS` = `official,team,@yourname`
4. Clone the repo locally and run `npm install && npm run dev`
5. Create demos in `src/demos/@yourname/` or `src/demos/private/`
6. Commit and push - Vercel auto-deploys!
```

### Step 5: Add Helper Scripts (Optional, 1 hour)

Create convenience scripts:

**`scripts/share-demo.mjs`** - Move demo from `private/` to `@username/`
```javascript
// Prompts: Which demo? (lists private/*.tsx)
// Moves: src/demos/private/demo.tsx → src/demos/@username/demo.tsx
// Commits automatically with message: "feat: share [demo-name]"
```

**`scripts/promote-demo.mjs`** - Move demo to `team/` or `official/`
```javascript
// Prompts: Which demo? (lists @username/*.tsx)
// Prompts: Promote to team/ or official/?
// Moves and commits with message
```

Add to `package.json`:
```json
{
  "scripts": {
    "demo:new": "node scripts/create-demo.mjs",
    "demo:share": "node scripts/share-demo.mjs",
    "demo:promote": "node scripts/promote-demo.mjs"
  }
}
```

---

## 🔄 Workflows & Examples

### Scenario 1: Designer Starting Fresh

```bash
# 1. Deploy to Vercel (one-time, via button in README)
#    Set VITE_SHOW_DEMOS=official,team,@sarah

# 2. Clone repo locally
git clone https://github.com/rippling/prototyping-playground
cd prototyping-playground
npm install

# 3. Create your personal folder
mkdir src/demos/@sarah

# 4. Start experimenting in private/
# Create: src/demos/private/my-first-demo.tsx

# 5. When ready to share, move to personal folder
npm run demo:share my-first-demo
# Or manually: git mv src/demos/private/my-first-demo.tsx src/demos/@sarah/

# 6. Push to GitHub
git add src/demos/@sarah/my-first-demo.tsx
git commit -m "feat: add my first demo"
git push

# 7. Vercel auto-deploys!
# Share link: https://sarah-prototyping-playground.vercel.app/my-first-demo
```

### Scenario 2: Developer Contributing to Official

```bash
# 1. Create demo in your personal folder
# src/demos/@paul/sortable-table.tsx

# 2. Get feedback from team
# Share link with colleagues

# 3. Team loves it, wants to collaborate
git mv src/demos/@paul/sortable-table.tsx src/demos/team/sortable-table.tsx
git commit -m "refactor: move sortable-table to team for collaboration"

# 4. Team iterates together in team/
# Multiple people commit to src/demos/team/sortable-table.tsx

# 5. After refinement, promote to official
git mv src/demos/team/sortable-table.tsx src/demos/official/sortable-table.tsx
git commit -m "feat: promote sortable-table to official demos"

# 6. Open PR to main
# Tag @design-systems-team for review
```

### Scenario 3: Team Collaboration on Client Demo

```bash
# 1. Create demo in team/ folder
# src/demos/team/client-onboarding-flow.tsx

# 2. Multiple people contribute
git pull
# Edit team/client-onboarding-flow.tsx
git commit -m "feat: add step 2 to onboarding flow"
git push

# 3. Present to client via team deployment
# https://team-prototyping-playground.vercel.app/client-onboarding-flow

# 4. Iterate based on feedback

# 5. If it becomes a pattern, promote to official
```

---

## 🌐 Vercel Deployment Configurations

### Main Deployment (Official Showcase)

**URL:** `prototyping-playground.vercel.app`

**Environment Variables:**
```bash
VITE_SHOW_DEMOS=official
```

**Purpose:** Public-facing showcase of blessed templates and patterns

---

### Team Deployment (Optional)

**URL:** `team-prototyping-playground.vercel.app`

**Environment Variables:**
```bash
VITE_SHOW_DEMOS=official,team
```

**Purpose:** Browse official demos + all collaborative work

---

### Personal Deployments

**URL:** `[yourname]-prototyping-playground.vercel.app`

**Environment Variables:**
```bash
# Show official, team, and your personal demos
VITE_SHOW_DEMOS=official,team,@yourname

# Or show everything (for browsing)
VITE_SHOW_DEMOS=official,team,@paul,@sarah,@nick

# Or show only yours (for focused work)
VITE_SHOW_DEMOS=@yourname
```

**Purpose:** Personal sandbox + ability to share demos with colleagues

---

## 📊 Success Metrics

After 2 weeks:
- ✅ 5+ people have their own Vercel deployments
- ✅ At least 3 new demos created in personal folders
- ✅ Zero "how do I deploy this?" questions (docs are clear)
- ✅ At least 1 demo graduated from personal → team or team → official

After 1 month:
- ✅ 10+ personal demos across team members
- ✅ 3+ team collaborative demos
- ✅ 2+ new official demos added
- ✅ Designers actively using `private/` folder for experiments

---

## 🎓 FAQs

### Q: Do I need to know Vercel to use this?
**A:** No! Click the "Deploy" button in README, follow the prompts. Vercel handles everything.

### Q: What if I mess up my deployment?
**A:** Delete the Vercel project and re-deploy. Your code is safe in GitHub.

### Q: Can I browse other people's demos?
**A:** Yes! All `@username/` and `team/` folders are committed to GitHub. You can:
- Browse code on GitHub
- Add their folder to your `VITE_SHOW_DEMOS` env var
- Copy their demos to your `private/` folder to learn from

### Q: How do I keep my work private until it's ready?
**A:** Work in `src/demos/private/` - it's gitignored and never leaves your machine.

### Q: Can I delete someone else's demo?
**A:** No (Git prevents this). You can only modify files in your `@username/` folder. For `team/` demos, coordinate with the team.

### Q: What if I want to start fresh without all the existing demos?
**A:** After cloning, delete demo files you don't want. Or set `VITE_SHOW_DEMOS=@yourname` to only see yours.

### Q: How do I get a demo from `private/` into my personal folder?
**A:** Run `npm run demo:share [demo-name]` or manually:
```bash
git mv src/demos/private/demo.tsx src/demos/@yourname/
git add src/demos/@yourname/demo.tsx
git commit -m "feat: share demo"
git push
```

---

## 🚧 Out of Scope (V2+ Features)

**Not included in MVP:**
- ❌ Authentication / user accounts
- ❌ Central demo gallery / marketplace UI
- ❌ Automated demo discovery across all deployments
- ❌ Demo versioning / history beyond Git
- ❌ Comments / feedback system
- ❌ "Star" or "favorite" demos
- ❌ Demo analytics / usage tracking

**Why:** These add complexity without clear value for MVP. Let's prove the basic workflow first, then enhance based on actual usage patterns.

---

## 📝 Next Steps

1. **Review this proposal** with the team
2. **Get buy-in** from at least 3-5 early adopters
3. **Implement** (estimated 2-4 hours):
   - Update folder structure
   - Add `.gitignore` entry
   - Add demo filtering logic
   - Add Vercel deploy button to README
   - Write README entries for each folder
4. **Test** with 2-3 team members deploying their own instances
5. **Iterate** based on feedback
6. **Document learnings** and adjust workflow as needed

---

## 🤝 Questions or Feedback?

Open an issue or reach out to @pbest (Paul Best) for questions about this workflow.

**Last Updated:** November 6, 2024  
**Status:** 📝 Proposal (Ready for Review)

