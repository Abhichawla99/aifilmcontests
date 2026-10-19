const { execSync } = require('child_process')

// Refresh the build-time contests snapshot (src/data/contests-snapshot.json)
// before every real `next build`. Can't be wired as an npm "prebuild" script
// because package.json is off-limits (robots/COMMON.md rule 3), so it's
// triggered from here instead. `next build` loads this file once in its main
// process with "build" as an argv entry; the per-page worker processes that
// reload this same config file don't carry that argv, so this still runs
// exactly once per build. `next dev`/`next start` never match, so a local
// dev server doesn't hit Supabase on every restart. Never blocks the build:
// the script itself is failure-tolerant, this is belt and suspenders.
if (process.argv.includes('build')) {
  try {
    execSync('node scripts/generate-contests-snapshot.mjs', { stdio: 'inherit' })
  } catch (err) {
    console.warn('Snapshot generation step failed, continuing build:', err.message)
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
}

module.exports = nextConfig
