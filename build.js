// build.js — esbuild bundler for LinkedIn AI Reply Assistant
// Bundles content scripts and background service worker into dist/
// Run: node build.js  (or: npm run build)

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const isDev = process.argv.includes('--dev');

const sharedConfig = {
  bundle: true,
  target: 'chrome112',
  platform: 'browser',
  minify: !isDev,
  sourcemap: isDev ? 'inline' : false,
  logLevel: 'info',
};

async function build() {
  // Ensure dist directories exist
  fs.mkdirSync('dist/content', { recursive: true });
  fs.mkdirSync('dist/background', { recursive: true });
  fs.mkdirSync('dist/popup', { recursive: true });
  fs.mkdirSync('dist/options', { recursive: true });

  const builds = [
    // Content script — bundled into single IIFE (no ES module, no imports)
    esbuild.build({
      ...sharedConfig,
      entryPoints: ['content/content.js'],
      outfile: 'content/content.bundle.js',
      format: 'iife',  // <-- key: wraps in IIFE, no import/export
      globalName: undefined,
    }),
    esbuild.build({
      ...sharedConfig,
      entryPoints: ['content/content.js'],
      outfile: 'dist/content/content.bundle.js',
      format: 'iife',
      globalName: undefined,
    }),

    // Background service worker — must be ES module format for MV3
    esbuild.build({
      ...sharedConfig,
      entryPoints: ['background/background.js'],
      outfile: 'background/background.bundle.js',
      format: 'esm',
    }),
    esbuild.build({
      ...sharedConfig,
      entryPoints: ['background/background.js'],
      outfile: 'dist/background/background.bundle.js',
      format: 'esm',
    }),

    // Popup script
    esbuild.build({
      ...sharedConfig,
      entryPoints: ['popup/popup.js'],
      outfile: 'popup/popup.bundle.js',
      format: 'iife',
    }),
    esbuild.build({
      ...sharedConfig,
      entryPoints: ['popup/popup.js'],
      outfile: 'dist/popup/popup.bundle.js',
      format: 'iife',
    }),

    // Options script
    esbuild.build({
      ...sharedConfig,
      entryPoints: ['options/options.js'],
      outfile: 'options/options.bundle.js',
      format: 'iife',
    }),
    esbuild.build({
      ...sharedConfig,
      entryPoints: ['options/options.js'],
      outfile: 'dist/options/options.bundle.js',
      format: 'iife',
    }),
  ];

  await Promise.all(builds);

  // Copy static assets (HTML, CSS, images, manifest) to dist/
  const staticFiles = [
    'manifest.json',
    'popup/popup.html',
    'popup/popup.css',
    'options/options.html',
    'options/options.css',
    'styles/injected.css',
    'styles/panel.css',
  ];

  fs.mkdirSync('dist/styles', { recursive: true });
  fs.mkdirSync('dist/assets', { recursive: true });

  for (const file of staticFiles) {
    const dest = path.join('dist', file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(file, dest);
  }

  // Copy assets (icons)
  for (const f of fs.readdirSync('assets')) {
    fs.copyFileSync(`assets/${f}`, `dist/assets/${f}`);
  }

  // Patch manifest.json in dist to point to dist paths
  // (remove type:module from content_scripts since it's now IIFE bundled)
  const manifest = JSON.parse(fs.readFileSync('dist/manifest.json', 'utf8'));
  delete manifest.content_scripts[0].type; // not needed for IIFE bundle
  fs.writeFileSync('dist/manifest.json', JSON.stringify(manifest, null, 2));

  console.log('\n✅ Build complete → load dist/ folder in Chrome\n');
}

build().catch(e => {
  console.error('Build failed:', e);
  process.exit(1);
});
