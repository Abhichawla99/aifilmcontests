#!/usr/bin/env node
// Tell IndexNow (Bing, Yandex, Seznam, Naver and others) that pages are new or changed.
// Google does not read IndexNow; it still relies on the sitemap and Search Console.
//
// Usage:
//   node scripts/indexnow-ping.mjs <url> [<url> ...]   ping these pages (full URLs or /paths)
//   node scripts/indexnow-ping.mjs --all               ping every URL in the live sitemap
//   add --dry-run to print the request without sending it
//
// The key is the file name of the single <32 hex>.txt in public/, which the site serves at
// https://aifilmcontests.com/<key>.txt. IndexNow keys are public by design.

import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HOST = 'aifilmcontests.com'
const BASE = `https://${HOST}`
const ENDPOINT = 'https://api.indexnow.org/indexnow'

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
const keyFile = readdirSync(publicDir).find(f => /^[a-f0-9]{32}\.txt$/.test(f))
const key = process.env.INDEXNOW_KEY || keyFile?.replace(/\.txt$/, '')
if (!key) {
  console.error('No IndexNow key: expected public/<32 hex>.txt or INDEXNOW_KEY')
  process.exit(2)
}

const args = process.argv.slice(2)
const dry = args.includes('--dry-run')
const all = args.includes('--all')
let urls = args.filter(a => !a.startsWith('--')).map(a => (a.startsWith('/') ? BASE + a : a))

if (all) {
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text()
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
}
urls = [...new Set(urls)].filter(u => new URL(u).host === HOST)
if (urls.length === 0) {
  console.error('No URLs to ping. Pass URLs or --all.')
  process.exit(2)
}

const body = { host: HOST, key, keyLocation: `${BASE}/${key}.txt`, urlList: urls.slice(0, 10000) }
if (dry) {
  console.log(JSON.stringify({ ...body, urlList: `${body.urlList.length} urls` }, null, 2))
  process.exit(0)
}

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
})
// 200 = accepted, 202 = accepted, key validation pending. 403/422 = key file not reachable or URLs off-host.
console.log(`IndexNow ${res.status} ${res.statusText}: ${body.urlList.length} urls`)
process.exit(res.status === 200 || res.status === 202 ? 0 : 1)
