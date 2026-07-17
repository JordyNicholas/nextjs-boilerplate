import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const siblingContract = resolve('..', 'ts-monolith', 'openapi', 'openapi.json');
const source =
  process.env.OPENAPI_SOURCE ??
  process.env.OPENAPI_URL ??
  ((await exists(siblingContract)) ? siblingContract : 'http://localhost:3333/docs/json');
const output = 'openapi/ts-monolith.json';

const document = isHttpUrl(source) ? await readRemote(source) : await readLocal(source);

await mkdir('openapi', { recursive: true });
await writeFile(output, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
console.log(`Synced ${source} → ${output}`);

function isHttpUrl(value) {
  return value.startsWith('http://') || value.startsWith('https://');
}

async function readRemote(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Unable to fetch OpenAPI schema from ${url}: ${response.status}`);
  }
  return response.json();
}

async function readLocal(path) {
  const absolutePath = resolve(path);
  try {
    return JSON.parse(await readFile(absolutePath, 'utf8'));
  } catch (error) {
    throw new Error(`Unable to read OpenAPI schema from ${absolutePath}`, { cause: error });
  }
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
