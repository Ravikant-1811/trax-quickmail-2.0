import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';
import { initialState } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localDataDir = path.join(__dirname, 'data');
const localDataFile = path.join(localDataDir, 'state.json');
const useDatabase = Boolean(process.env.DATABASE_URL);

let localStateCache = null;
let pool = null;
let dbReady = false;

function getPool() {
  if (!useDatabase) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
      max: 1,
    });
  }

  return pool;
}

async function ensureLocalStore() {
  await fs.mkdir(localDataDir, { recursive: true });
  try {
    await fs.access(localDataFile);
  } catch {
    await fs.writeFile(localDataFile, JSON.stringify(initialState, null, 2), 'utf8');
  }
}

async function initDatabase() {
  const db = getPool();
  if (!db || dbReady) {
    return;
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS traxquickmail_state (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const result = await db.query('SELECT payload FROM traxquickmail_state WHERE id = $1 LIMIT 1', ['default']);
  if (result.rowCount === 0) {
    await db.query(
      'INSERT INTO traxquickmail_state (id, payload) VALUES ($1, $2)',
      ['default', initialState],
    );
  }

  dbReady = true;
}

async function readDatabaseState() {
  const db = getPool();
  await initDatabase();
  const result = await db.query('SELECT payload FROM traxquickmail_state WHERE id = $1 LIMIT 1', ['default']);
  if (result.rowCount === 0) {
    return structuredClone(initialState);
  }

  return structuredClone(result.rows[0].payload);
}

async function writeDatabaseState(nextState) {
  const db = getPool();
  await initDatabase();
  await db.query(
    'UPDATE traxquickmail_state SET payload = $2, updated_at = NOW() WHERE id = $1',
    ['default', nextState],
  );
  return structuredClone(nextState);
}

async function readLocalState() {
  if (localStateCache) {
    return structuredClone(localStateCache);
  }

  await ensureLocalStore();
  const raw = await fs.readFile(localDataFile, 'utf8');
  localStateCache = JSON.parse(raw);
  return structuredClone(localStateCache);
}

async function writeLocalState(nextState) {
  await ensureLocalStore();
  localStateCache = structuredClone(nextState);
  await fs.writeFile(localDataFile, JSON.stringify(localStateCache, null, 2), 'utf8');
  return structuredClone(localStateCache);
}

export async function readState() {
  if (useDatabase) {
    return readDatabaseState();
  }

  return readLocalState();
}

export async function writeState(nextState) {
  if (useDatabase) {
    return writeDatabaseState(nextState);
  }

  return writeLocalState(nextState);
}

export async function updateState(mutator) {
  const current = await readState();
  const next = await mutator(current);
  if (!next || typeof next !== 'object') {
    throw new Error('State mutator must return a state object');
  }

  return writeState(next);
}

export function usingDatabase() {
  return useDatabase;
}
