#!/usr/bin/env node
import { access, copyFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

if (!(await exists('.env.local'))) {
  await copyFile('.env.example', '.env.local');
  console.log('Created .env.local from .env.example.');
} else {
  console.log('Keeping existing .env.local.');
}

run('api:sync');
run('api:generate');

console.log('');
console.log('Setup complete. Start the frontend with: npm run dev');

function run(script) {
  console.log(`> npm run ${script}`);
  const windows = process.platform === 'win32';
  const executable = windows ? (process.env.ComSpec ?? 'cmd.exe') : 'npm';
  const args = windows ? ['/d', '/s', '/c', `npm run ${script}`] : ['run', script];
  const result = spawnSync(executable, args, { stdio: 'inherit' });

  if (result.error) {
    console.error(`Unable to run npm: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
