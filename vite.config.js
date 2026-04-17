import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// Build-time version stamp. Used both to invalidate the Service Worker
// cache on every deploy (see public/sw.js) and exposed to the app as
// __BUILD_VERSION__ so we can show it in the UI if needed. Format:
// YYYYMMDDHHmm (UTC) — monotonically increasing, human-readable.
const now = new Date();
const pad = n => String(n).padStart(2, '0');
const BUILD_VERSION = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}`;

// Post-build plugin: after Vite copies public/sw.js to dist/, replace
// the __BUILD_VERSION__ placeholder with the current build version so
// each deploy bumps the SW cache automatically. Avoids the human step
// of remembering to bump CACHE_VERSION by hand.
const swVersionPlugin = {
  name: 'sw-version-stamp',
  apply: 'build',
  closeBundle() {
    const distSw = path.resolve(process.cwd(), 'dist', 'sw.js');
    try {
      if (fs.existsSync(distSw)) {
        const raw = fs.readFileSync(distSw, 'utf8');
        const stamped = raw.replace(/__BUILD_VERSION__/g, BUILD_VERSION);
        fs.writeFileSync(distSw, stamped);
      }
    } catch (err) {
      console.warn('[sw-version-stamp] failed:', err.message);
    }
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), swVersionPlugin],
  define: {
    __BUILD_VERSION__: JSON.stringify(BUILD_VERSION),
  },
  build: {
    // Slightly more generous than Vite's default 500 kB so we don't get a
    // noisy warning on the single-file App.jsx (it's ~330 kB of data).
    chunkSizeWarningLimit: 800,
  },
  test: {
    // jsdom gives us document/window so React components can mount in tests.
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
  },
})
