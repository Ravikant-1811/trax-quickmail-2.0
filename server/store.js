import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialState } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'state.json');

let stateCache = null;

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(initialState, null, 2), 'utf8');
  }
}

export async function readState() {
  if (stateCache) {
    return structuredClone(stateCache);
  }

  await ensureStore();
  const raw = await fs.readFile(dataFile, 'utf8');
  stateCache = JSON.parse(raw);
  return structuredClone(stateCache);
}

export async function writeState(nextState) {
  await ensureStore();
  stateCache = structuredClone(nextState);
  await fs.writeFile(dataFile, JSON.stringify(stateCache, null, 2), 'utf8');
  return structuredClone(stateCache);
}

export async function updateState(mutator) {
  const current = await readState();
  const next = await mutator(current);
  if (!next || typeof next !== 'object') {
    throw new Error('State mutator must return a state object');
  }

  return writeState(next);
}

export function getDataFilePath() {
  return dataFile;
}
