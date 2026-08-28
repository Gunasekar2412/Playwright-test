#!/usr/bin/env node
/**
 * Compares path keys between vendored env15 and env16 swagger files.
 * Run: node scripts/check-dxp-spec.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const env15 = join(root, 'specs', 'dxp-swagger-env15.json');
const env16 = join(root, 'specs', 'dxp-swagger-env16.json');

for (const p of [env15, env16]) {
  if (!existsSync(p)) {
    console.error(`Missing ${p} — run npm run fetch:dxp-swagger`);
    process.exit(1);
  }
}

const j15 = JSON.parse(readFileSync(env15, 'utf8'));
const j16 = JSON.parse(readFileSync(env16, 'utf8'));
const p15 = new Set(Object.keys(j15.paths || {}));
const p16 = new Set(Object.keys(j16.paths || {}));
const only15 = [...p15].filter((k) => !p16.has(k));
const only16 = [...p16].filter((k) => !p15.has(k));

console.log(`env15 paths: ${p15.size}, env16 paths: ${p16.size}`);
if (only15.length || only16.length) {
  console.warn('Path drift between env15 and env16:');
  if (only15.length) console.warn('Only env15:', only15.slice(0, 20), only15.length > 20 ? '...' : '');
  if (only16.length) console.warn('Only env16:', only16.slice(0, 20), only16.length > 20 ? '...' : '');
  process.exitCode = 1;
} else {
  console.log('No path key differences between env15 and env16 specs.');
}
