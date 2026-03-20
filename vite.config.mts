import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OVERRIDE_DIR = path.resolve(__dirname, 'src/overrides');
const APPS_DIR = path.resolve(__dirname, 'src/apps');
const DISCOVER_FILE = path.resolve(__dirname, 'src/shared/utils/discover-apps.ts');

/**
 * Watches src/apps/ for structural changes (new/removed folders and config files)
 * and forces a full reload so import.meta.glob picks up the new entries.
 * Without this, adding a new app or prototype requires a manual server restart.
 */
function appsHotReload(): Plugin {
  return {
    name: 'apps-hot-reload',
    configureServer(server) {
      if (!fs.existsSync(APPS_DIR)) return;

      const snapshot = () => {
        try {
          const entries: string[] = [];
          const walk = (dir: string) => {
            for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
              const full = path.join(dir, entry.name);
              if (entry.isDirectory()) {
                entries.push(full);
                walk(full);
              } else if (
                entry.name === 'app.config.ts' ||
                entry.name === 'index.tsx' ||
                entry.name === 'present.tsx' ||
                entry.name === 'engineering.tsx'
              ) {
                entries.push(full);
              }
            }
          };
          walk(APPS_DIR);
          return entries.sort().join('\n');
        } catch {
          return '';
        }
      };

      let lastSnapshot = snapshot();

      const check = () => {
        const current = snapshot();
        if (current !== lastSnapshot) {
          lastSnapshot = current;
          // Touch the discover-apps file so Vite invalidates it
          const now = new Date();
          try {
            fs.utimesSync(DISCOVER_FILE, now, now);
          } catch {
            // If touch fails, force full reload
          }
          server.ws.send({ type: 'full-reload' });
          console.log('  🔄 Apps structure changed — reloading');
        }
      };

      // Poll every 1.5s — lightweight since we only stat a shallow tree
      const interval = setInterval(check, 1500);
      server.httpServer?.on('close', () => clearInterval(interval));
    },
  };
}

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    appsHotReload(),
  ],
  server: {
    port: 4201,
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
      interval: 200,
    },
  },
  resolve: {
    alias: [
      // Local workspace alias
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
      
      // Smart override system: Only intercepts when override exists in src/overrides
      // Otherwise falls back to node_modules (no monorepo required)
      {
        find: /^@rippling\/pebble\/(.+)$/,
        customResolver(source, importer, options) {
          // Only handle imports that match our pattern
          const match = source.match(/^@rippling\/pebble\/(.+)$/);
          if (!match) return null;
          
          const componentPath = match[1];
          const overrideBase = path.resolve(OVERRIDE_DIR, componentPath);
          const extensions = ['', '.ts', '.tsx', '.js', '.jsx'];
          
          // Check if override exists as a file
          for (const ext of extensions) {
            const overridePath = overrideBase + ext;
            if (fs.existsSync(overridePath) && fs.statSync(overridePath).isFile()) {
              console.log(`  🎨 Using override: ${componentPath}${ext}`);
              return overridePath;
            }
          }
          
          // Check if override exists as a directory with index file
          if (fs.existsSync(overrideBase) && fs.statSync(overrideBase).isDirectory()) {
            for (const ext of ['.ts', '.tsx', '.js', '.jsx']) {
              const indexPath = path.resolve(overrideBase, `index${ext}`);
              if (fs.existsSync(indexPath)) {
                console.log(`  🎨 Using override: ${componentPath}/index${ext}`);
                return overrideBase;
              }
            }
          }
          
          // No override found - let Vite use normal resolution (node_modules)
          return null;
        },
      },
    ],
  },
  define: {
    'process.env': {},
    'process.platform': JSON.stringify(''),
    'process.version': JSON.stringify(''),
  },
});


