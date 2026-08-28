# DXP OpenAPI specs

JSON snapshots from `{host}/dxp-api/swagger.json` for contract reference and type generation.

| File | Source |
|------|--------|
| `dxp-swagger-env15.json` | env15 test |
| `dxp-swagger-env16.json` | env16 test (API version may differ from env15) |
| `dxp-swagger-env1-stage.json` | env1 stage |

**Refresh cadence:** after DXP releases or when debugging contract drift, run `npm run fetch:dxp-swagger` (requires network access to BCIC). Commit updated JSON when your team wants CI to diff against a known baseline.

**Type generation:** `npm run generate:dxp-types` converts `dxp-swagger-env15.json` → OpenAPI 3 (`specs/dxp-openapi-env15.json`, gitignored) and regenerates `lib/dxp/types/dxp-api.d.ts`. Run after refreshing the swagger file.

**Drift check:** `npm run check:dxp-spec` compares path keys in env15 vs env16 specs.
