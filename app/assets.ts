import * as path from 'node:path'

import { createAssetServer } from 'remix/assets'

const isDevelopment = (process.env.NODE_ENV ?? 'development') === 'development'

// Compiles browser modules on demand. Only pages with a clientEntry() component
// load any of them; everything else on the site ships zero JavaScript.
export const assets = createAssetServer({
  basePath: '/assets',
  rootDir: path.resolve(import.meta.dirname, '..'),
  allowFiles: ['app/**/public/**'],
  allowPackages: ['remix'],
  denyFiles: ['app/**/*.test.*'],
  sourceMaps: isDevelopment ? 'external' : undefined,
  minify: !isDevelopment,
  watch: isDevelopment,
})

export const scriptEntryPath = 'app/actions/public/entry.ts'

export const scriptEntry = await assets.getScriptEntry(scriptEntryPath)
