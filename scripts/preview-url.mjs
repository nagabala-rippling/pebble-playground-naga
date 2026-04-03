#!/usr/bin/env node

/**
 * Fetches the preview deployment URL for the current branch and saves it
 * to .env.local so the local dev server can display it.
 *
 * Requires: gh (GitHub CLI) authenticated.
 * Usage: npm run preview-url
 */

import { execFileSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const ENV_FILE = resolve(import.meta.dirname, '..', '.env.local');
const ENV_KEY = 'VITE_DEPLOY_URL';
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
    log(`  Watch it: https://github.com/Rippling/prototyping-playground/actions/runs/${databaseId}\n`);
    process.exit(0);
  }

  if (conclusion !== 'success') {
    log(`  ❌ Last deploy failed (${conclusion}).`);
    log(`  Check logs: https://github.com/Rippling/prototyping-playground/actions/runs/${databaseId}\n`);
    process.exit(quiet ? 0 : 1);
  }

  const logs = execFileSync('gh', [
    'run', 'view', String(databaseId), '--log',
  ], { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  const match = logs.match(/(https:\/\/prototyping-playground-[^\s]+\.vercel\.app)/);

  if (match) {
    const url = match[1];
    writeUrlToEnv(url);
    log(`  🔗 Preview URL: ${url}\n`);
  } else {
    log('  Deploy succeeded but could not extract URL from logs.');
    log(`  Check: https://github.com/Rippling/prototyping-playground/actions/runs/${databaseId}\n`);
  }
} catch (err) {
  if (quiet) {
    process.exit(0);
  }
  console.error('  Error:', err.message);
  process.exit(1);
}
