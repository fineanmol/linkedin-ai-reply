// test/helpers/load.mjs — load an extension source module in Node.
// The sources are ES modules inside a "type":"commonjs" package, so instead of
// relying on Node's module-type detection we bundle the entry with esbuild
// (already a devDependency) into a temp .mjs file and import that. Each call
// returns a FRESH module instance (own module-level state), which keeps test
// files isolated from each other.

import { build } from 'esbuild';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

const tmpDirs = [];
process.on('exit', () => {
  for (const d of tmpDirs) { try { rmSync(d, { recursive: true, force: true }); } catch {} }
});

/**
 * Bundle `relPath` (relative to the repo root) and import it.
 * @param {string} relPath e.g. 'background/prompt-builder.js'
 */
export async function loadModule(relPath) {
  return import(pathToFileURL(await bundleModule(relPath)).href);
}

/** Bundle `relPath` to a temp .mjs file and return its absolute path. */
export async function bundleModule(relPath) {
  const dir = mkdtempSync(join(tmpdir(), 'liar-test-'));
  tmpDirs.push(dir);
  const outfile = join(dir, 'bundle.mjs');
  await build({
    entryPoints: [join(ROOT, relPath)],
    outfile,
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node22',
    logLevel: 'silent',
    // Some deps call require() for Node built-ins; give the ESM bundle one.
    banner: { js: "import { createRequire as __cr } from 'node:module'; const require = __cr(import.meta.url);" },
  });
  return outfile;
}
