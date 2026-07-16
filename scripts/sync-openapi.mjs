import { mkdir, writeFile } from 'node:fs/promises';

const source = process.env.OPENAPI_URL ?? 'http://localhost:3333/docs/json';
const output = 'openapi/ts-monolith.json';
const response = await fetch(source);

if (!response.ok) {
  throw new Error(`Unable to fetch OpenAPI schema from ${source}: ${response.status}`);
}

await mkdir('openapi', { recursive: true });
await writeFile(output, `${JSON.stringify(await response.json(), null, 2)}\n`, 'utf8');
console.log(`Synced ${source} → ${output}`);
