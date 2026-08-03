// Server-only. Reads/writes the app's single data file directly in the
// GitHub repo via the Contents API, using a fine-grained PAT stored in
// the GITHUB_TOKEN env var. Never import this from client components.

import { DayStatus, StoreData } from './types';
import { DEFAULT_SETTINGS } from './constants';

const OWNER = process.env.GITHUB_REPO_OWNER || 'eschgfaeller';
const REPO = process.env.GITHUB_REPO_NAME || 'Freelancer_radar';
const BRANCH = process.env.GITHUB_REPO_BRANCH || 'main';
const FILE_PATH = 'data/freelancer-data.json';

const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;

function authHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN is not configured on the server.');
  }
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function isValidStoreData(value: unknown): value is StoreData {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  if (typeof v.settings !== 'object' || v.settings === null) return false;
  if (typeof v.days !== 'object' || v.days === null) return false;
  const settings = v.settings as Record<string, unknown>;
  return (
    typeof settings.dailyRate === 'number' &&
    typeof settings.netRatio === 'number'
  );
}

interface FetchedFile {
  data: StoreData;
  sha: string;
}

export async function fetchStoreData(): Promise<FetchedFile> {
  const res = await fetch(`${API_BASE}?ref=${BRANCH}`, {
    headers: authHeaders(),
    cache: 'no-store',
  });

  if (res.status === 404) {
    // File doesn't exist yet — treat as a fresh install.
    return {
      data: { settings: { ...DEFAULT_SETTINGS }, days: {} },
      sha: '',
    };
  }

  if (!res.ok) {
    throw new Error(`GitHub API error fetching data file: ${res.status}`);
  }

  const json = await res.json();
  const content = Buffer.from(json.content, 'base64').toString('utf-8');
  const parsed = JSON.parse(content);

  if (!isValidStoreData(parsed)) {
    throw new Error('Data file in GitHub repo has an unexpected shape.');
  }

  return { data: parsed, sha: json.sha as string };
}

export async function saveStoreData(data: StoreData): Promise<void> {
  // Re-fetch the current sha right before writing to minimize the window
  // for a lost-update race (single-user app, so this is best-effort, not
  // a strict conflict resolution strategy).
  const { sha } = await fetchStoreData();

  const content = Buffer.from(JSON.stringify(data, null, 2), 'utf-8').toString(
    'base64'
  );

  const body: Record<string, unknown> = {
    message: `Update freelancer data (${new Date().toISOString()})`,
    content,
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(API_BASE, {
    method: 'PUT',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub API error saving data file: ${res.status} ${text}`);
  }
}

export type { StoreData, DayStatus };
