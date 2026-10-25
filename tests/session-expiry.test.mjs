import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test } from 'node:test'

// Load the real API module with Vite's build-time environment replaced.
const source = (await readFile(new URL('../src/services/api.js', import.meta.url), 'utf8'))
  .replace('import.meta.env.VITE_API_URL', 'undefined')
const api = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
let stored, events
const reset = () => {
  stored = JSON.stringify({ token: 'old' })
  events = 0
  globalThis.localStorage = {
    getItem: () => stored,
    removeItem: () => { stored = null },
  }
  globalThis.window = { dispatchEvent: () => { events++ } }
  globalThis.fetch = async () => ({ status: 401, ok: false, json: async () => ({ message: 'Unauthorized' }) })
}

test('protected JSON, upload, image replacement and PDF failures end the session', async () => {
  for (const request of [() => api.getDashboardStats(), () => api.createLostItem(new FormData()),
    () => api.updateLostItemImage('item', new Blob(['image'])), () => api.downloadReceiptPDF('item')]) {
    reset()
    await assert.rejects(request, /session has ended/)
    assert.equal(stored, null)
    assert.equal(events, 1)
  }
})
test('wrong password and forbidden access do not end a session', async () => {
  reset()
  await assert.rejects(() => api.loginUser({}), /Unauthorized/)
  assert.equal(events, 0)
  globalThis.fetch = async () => ({ status: 403, ok: false, json: async () => ({ message: 'Forbidden' }) })
  await assert.rejects(() => api.getDashboardStats(), /Forbidden/)
  assert.equal(events, 0)
  assert.ok(stored)
})
test('a late response from an old session cannot log out a new login', async () => {
  reset()
  globalThis.fetch = async () => {
    stored = JSON.stringify({ token: 'new' })
    return { status: 401, ok: false, json: async () => ({ message: 'Unauthorized' }) }
  }
  await assert.rejects(() => api.getDashboardStats(), /Unauthorized/)
  assert.equal(JSON.parse(stored).token, 'new')
  assert.equal(events, 0)
})
