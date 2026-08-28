#!/usr/bin/env node
/**
 * Downloads OpenAPI (Swagger) JSON from BCIC DXP environments into specs/.
 * Usage: node scripts/fetch-dxp-swagger.mjs
 *
 * Override URLs: DXP_SWAGGER_URL_ENV15, DXP_SWAGGER_URL_ENV16, DXP_SWAGGER_URL_STAGE
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const specsDir = join(root, 'specs');

const targets = [
  {
    file: 'dxp-swagger-env15.json',
    url:
      process.env.DXP_SWAGGER_URL_ENV15 ??
      'https://env15.test.aws02.bcic.cloud/dxp-api/swagger.json',
  },
  {
    file: 'dxp-swagger-env16.json',
    url:
      process.env.DXP_SWAGGER_URL_ENV16 ??
      'https://env16.test.aws02.bcic.cloud/dxp-api/swagger.json',
  },
  {
    file: 'dxp-swagger-env1-stage.json',
    url:
      process.env.DXP_SWAGGER_URL_STAGE ??
      'https://env1.stage.aws02.bcic.cloud/dxp-api/swagger.json',
  },
];

mkdirSync(specsDir, { recursive: true });

for (const { file, url } of targets) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    console.error(`Failed ${file}: ${res.status} ${res.statusText} (${url})`);
    process.exitCode = 1;
    continue;
  }
  const text = await res.text();
  writeFileSync(join(specsDir, file), text, 'utf8');
  console.log(`Wrote specs/${file} (${text.length} bytes)`);
}
