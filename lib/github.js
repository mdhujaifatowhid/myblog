// lib/github.js
// Thin wrapper around the GitHub Contents API.
// All posts/images live as real files inside this same GitHub repo.
// Writing through the admin panel = committing files via this API.
// Writing directly on GitHub.com (web UI) works exactly the same way,
// because both end up as commits to the same paths.

const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const TOKEN = process.env.GITHUB_TOKEN;

const API_BASE = 'https://api.github.com';

function authHeaders() {
  if (!TOKEN) {
    throw new Error('GITHUB_TOKEN is not set. Add it to your environment variables.');
  }
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function repoPath(path) {
  return `${API_BASE}/repos/${OWNER}/${REPO}/contents/${path}`;
}

// Get a file's content + sha. Returns null if it doesn't exist.
export async function getFile(path) {
  const res = await fetch(`${repoPath(path)}?ref=${BRANCH}`, {
    headers: authHeaders(),
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub getFile failed (${res.status}): ${await res.text()}`);
  const data = await res.json();
  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  return { content, sha: data.sha };
}

// List files in a directory. Returns [] if directory doesn't exist.
export async function listDir(path) {
  const res = await fetch(`${repoPath(path)}?ref=${BRANCH}`, {
    headers: authHeaders(),
    cache: 'no-store',
  });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`GitHub listDir failed (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// Create or update a text file (markdown, etc).
export async function putFile(path, contentString, message, sha) {
  const res = await fetch(repoPath(path), {
    method: 'PUT',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: Buffer.from(contentString, 'utf-8').toString('base64'),
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) throw new Error(`GitHub putFile failed (${res.status}): ${await res.text()}`);
  return res.json();
}

// Create or update a binary file (images) from a base64 string (no prefix).
export async function putBinaryFile(path, base64String, message, sha) {
  const res = await fetch(repoPath(path), {
    method: 'PUT',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: base64String,
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) throw new Error(`GitHub putBinaryFile failed (${res.status}): ${await res.text()}`);
  return res.json();
}

export async function deleteFile(path, message, sha) {
  const res = await fetch(repoPath(path), {
    method: 'DELETE',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sha, branch: BRANCH }),
  });
  if (!res.ok) throw new Error(`GitHub deleteFile failed (${res.status}): ${await res.text()}`);
  return res.json();
}

export function rawUrl(path) {
  return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path}`;
}
