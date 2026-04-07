#!/usr/bin/env node

/**
 * Fetches the preview deployment URL for the current branch and saves it
 * to .env.local so the local dev server can display it.
 *
 * Strategy:
 * 1. Find the latest successful "Deploy Preview" workflow run for this branch
 * 2. Extract the actual deployed URL from:
 *    a. The PR comment (workflow posts it with a <!-- vercel-preview --> marker)
 *    b. The workflow run logs (fallback — parses the `vercel deploy` output)
 * 3. Save to .env.local as VITE_DEPLOY_URL
 *
 * Requires: gh (GitHub CLI) authenticated.
 * Usage: npm run preview-url
 */

import { execFileSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const ENV_FILE = resolve(import.meta.dirname, '..', '.env.local');
const ENV_KEY = 'VITE_DEPLOY_URL';
const REPO = 'Rippling/prototyping-playground';
const quiet = process.argv.includes('--quiet');

function log(...args) {
  if (!quiet) console.log(...args);
}

function readCurrentUrl() {
  try {
    const content = readFileSync(ENV_FILE, 'utf-8');
    const match = content.match(new RegExp(`^${ENV_KEY}=(.+)$`, 'm'));
    return match ? match[1] : '';
  } catch {
    return '';
  }
}

function writeUrlToEnv(url) {
  let content = '';
  try {
    content = readFileSync(ENV_FILE, 'utf-8');
  } catch {}

  const lines = content.split('\n').filter(l => !l.startsWith(`${ENV_KEY}=`));
  if (url) lines.push(`${ENV_KEY}=${url}`);
  writeFileSync(ENV_FILE, lines.filter(Boolean).join('\n') + '\n');
}

function ghAvailable() {
  try {
    execFileSync('which', ['gh'], { encoding: 'utf-8' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract the deploy URL from the PR comment left by the workflow.
 * The workflow posts a comment with marker `<!-- vercel-preview -->` containing
 * the actual hash-based Vercel URL.
 */
function getUrlFromPrComment(branch) {
  try {
    const output = execFileSync('gh', [
      'pr', 'view', branch,
      '--repo', REPO,
      '--json', 'comments',
    ], { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });

    const { comments } = JSON.parse(output);
    for (const comment of (comments || [])) {
      if (comment.body?.includes('<!-- vercel-preview -->')) {
        const match = comment.body.match(/https:\/\/[a-z0-9-]+\.vercel\.app/);
        if (match) return match[0];
      }
    }
  } catch {
    // No PR found for this branch, or gh command failed
  }
  return null;
}

/**
 * Extract the deploy URL from the workflow run logs.
 * The deploy step captures the `vercel deploy --prebuilt` output which is the
 * hash-based deployment URL.
 */
function getUrlFromRunLogs(runId) {
  try {
    const logs = execFileSync('gh', [
      'run', 'view', String(runId),
      '--repo', REPO,
      '--log',
    ], { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });

    // Match hash-based preview URLs (e.g. prototyping-playground-7w5gtta6b-rippling.vercel.app)
    // Exclude production URLs (-two.vercel.app) and bare project URLs
    const urlPattern = /https:\/\/prototyping-playground-[a-z0-9]+-rippling\.vercel\.app/g;
    const matches = [...new Set(logs.match(urlPattern) || [])];

    // Prefer the hash-based URL (from `vercel deploy`) over the branch alias
    return matches.find(u => !u.includes('-git-')) || matches[0] || null;
  } catch {}
  return null;
}

try {
  if (!ghAvailable()) {
    if (quiet) {
      const existing = readCurrentUrl();
      if (existing) log(`  🔗 Using cached preview URL: ${existing}`);
      process.exit(0);
    }
    console.error('  GitHub CLI (gh) is required. Install: https://cli.github.com\n');
    process.exit(1);
  }

  const branch = execFileSync('git', ['branch', '--show-current'], { encoding: 'utf-8' }).trim();
  if (!branch) {
    if (!quiet) console.error('Could not determine current branch.');
    process.exit(quiet ? 0 : 1);
  }

  if (branch === 'main') {
    const url = 'https://prototyping-playground.vercel.app';
    writeUrlToEnv(url);
    log(`  🔗 Preview URL: ${url}`);
    process.exit(0);
  }

  log(`\n  Branch: ${branch}`);
  log('  Checking latest deploy...\n');

  const runJson = execFileSync('gh', [
    'run', 'list',
    '--workflow=preview.yml',
    `--branch`, branch,
    '--repo', REPO,
    '-L1',
    '--json', 'databaseId,status,conclusion',
    '-q', '.[0]',
  ], { encoding: 'utf-8' }).trim();

  if (!runJson) {
    log('  No deployments found for this branch.');
    log(`  Push your branch to trigger a deploy: git push -u origin HEAD\n`);
    process.exit(0);
  }

  const { databaseId, status, conclusion } = JSON.parse(runJson);

  if (status === 'in_progress' || status === 'queued') {
    log('  ⏳ Deploy in progress...');
    log(`  Watch it: https://github.com/${REPO}/actions/runs/${databaseId}\n`);
    process.exit(0);
  }

  if (conclusion !== 'success') {
    log(`  ❌ Last deploy failed (${conclusion}).`);
    log(`  Check logs: https://github.com/${REPO}/actions/runs/${databaseId}\n`);
    process.exit(quiet ? 0 : 1);
  }

  log('  Fetching deploy URL...');

  // Strategy 1: Extract from PR comment (fastest — no log download)
  let url = getUrlFromPrComment(branch);
  if (url) {
    log('  (found in PR comment)');
  }

  // Strategy 2: Extract from workflow run logs
  if (!url) {
    log('  No PR comment found, checking run logs...');
    url = getUrlFromRunLogs(databaseId);
  }

  if (!url) {
    log(`  ⚠️  Could not extract deploy URL.`);
    log(`  Check the run: https://github.com/${REPO}/actions/runs/${databaseId}\n`);
    process.exit(quiet ? 0 : 1);
  }

  writeUrlToEnv(url);
  log(`  🔗 Preview URL: ${url}\n`);
} catch (err) {
  if (quiet) {
    process.exit(0);
  }
  console.error('  Error:', err.message);
  process.exit(1);
}
