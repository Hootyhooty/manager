/**
 * Uses Vite dev proxy `/api` → backend (see vite.config.js).
 * For production, set VITE_API_URL to the API origin (no trailing slash).
 */
function apiUrl(path) {
  const base = import.meta.env.VITE_API_URL || ''
  return base ? `${base}${path}` : path
}

export async function apiGet(path) {
  const res = await fetch(apiUrl(path))
  if (!res.ok) throw new Error((await res.text()) || res.statusText)
  return res.json()
}

export async function apiPost(path, body) {
  const res = await fetch(apiUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  })
  if (!res.ok) throw new Error((await res.text()) || res.statusText)
  return res.json()
}
