// Prerenders every page to static files in dist/ so the site can be hosted on
// any static host. It's deployed to GitHub Pages by .github/workflows/deploy.yml.
//
//   npm run build
//
// The app itself is unchanged: we just ask the router for each URL.

import * as fs from 'node:fs/promises'
import * as path from 'node:path'

import { getPosts } from '../app/data/posts.ts'
import { redirects } from '../app/data/redirects.ts'
import { profile } from '../app/data/profile.ts'
import { router } from '../app/router.tsx'
import { routes } from '../app/routes.ts'

const outDir = path.resolve(import.meta.dirname, '../dist')
const publicDir = path.resolve(import.meta.dirname, '../public')

await fs.rm(outDir, { recursive: true, force: true })
await fs.cp(publicDir, outDir, { recursive: true })

let posts = await getPosts()

// 1. Pages
//
// Each entry is [url, output file]. GitHub Pages serves /foo from foo.html, so
// pages are written that way to keep URLs clean without trailing-slash
// redirects. The blog index is also written as blog/index.html so /blog/ works.
let pages: Array<[string, string]> = [
  [routes.home.href(), 'index.html'],
  [routes.blog.index.href(), 'blog.html'],
  [routes.blog.index.href(), 'blog/index.html'],
  ...posts.map((post): [string, string] => [
    routes.blog.show.href({ slug: post.slug }),
    `blog/${post.slug}.html`,
  ]),
  [routes.calc.href(), 'calc.html'],
  [routes.feed.href(), 'feed.xml'],
  ['/__not-found__', '404.html'],
]

let html = new Map<string, string>()

for (let [url, file] of pages) {
  let expected = file === '404.html' ? 404 : 200
  html.set(file, await fetchText(url, expected))
}

// 2. Browser modules
//
// Crawl every /assets/ URL the pages reference, then every module those
// modules import. GitHub Pages serves .ts/.tsx files with non-JavaScript MIME
// types (e.g. .ts is video/mp2t), which browsers refuse to run as modules, so
// those are written with an extra .js extension and references are rewritten.
let assetUrlPattern = /\/assets\/[^"'\s)]+?\.(?:m?js|tsx?|jsx|css)(?=["'\s)])/g
// Imports between app modules stay relative, e.g. from "./calculator-state.ts".
let relativeImportPattern = /(\bfrom\s*|\bimport\s*\(?\s*)(["'])(\.{1,2}\/[^"']+)\2/g
let renamed = new Map<string, string>()
let modules = new Map<string, string>()
let queue = [...html.values()].flatMap((text) => text.match(assetUrlPattern) ?? [])

while (queue.length > 0) {
  let url = queue.pop()!
  if (modules.has(url)) continue

  let text = await fetchText(url, 200)
  modules.set(url, text)
  if (/\.(?:tsx?|jsx)$/.test(url)) renamed.set(url, `${url}.js`)
  queue.push(...(text.match(assetUrlPattern) ?? []))
  for (let [, , , specifier] of text.matchAll(relativeImportPattern)) {
    queue.push(new URL(specifier, `http://localhost${url}`).pathname)
  }
}

function rewriteUrls(text: string): string {
  for (let [from, to] of renamed) text = text.replaceAll(`${from}"`, `${to}"`)
  return text
}

function rewriteModule(text: string): string {
  // Every .ts/.tsx/.jsx module is renamed by appending .js, so relative
  // imports of them get the same treatment. (Only in modules: pages may show
  // code samples with imports like these.)
  return rewriteUrls(text).replace(relativeImportPattern, (match, prefix, quote, specifier) =>
    /\.(?:tsx?|jsx)$/.test(specifier) ? `${prefix}${quote}${specifier}.js${quote}` : match,
  )
}

for (let [file, text] of html) await write(file, rewriteUrls(text))
for (let [url, text] of modules) {
  await write(decodeURIComponent(renamed.get(url) ?? url).slice(1), rewriteModule(text))
}

// 3. Redirects for old URLs
let redirectFiles = new Map<string, string>()
for (let [from, to] of Object.entries(redirects)) {
  let file = from.endsWith('/') ? `${from}index.html` : from.endsWith('.html') ? from : `${from}.html`
  redirectFiles.set(file.slice(1), to)
}
for (let [file, to] of redirectFiles) await write(file, redirectPage(to))

console.log(
  `\nBuilt ${html.size} pages, ${modules.size} browser modules, and ${redirectFiles.size} redirects into dist/`,
)

async function fetchText(url: string, expectedStatus: number): Promise<string> {
  let response = await router.fetch(new URL(url, 'http://localhost'))
  if (response.status !== expectedStatus) {
    throw new Error(`GET ${url} returned ${response.status}, expected ${expectedStatus}`)
  }
  return response.text()
}

async function write(file: string, content: string): Promise<void> {
  let target = path.join(outDir, file)
  await fs.mkdir(path.dirname(target), { recursive: true })
  await fs.writeFile(target, content)
  if (!file.startsWith('assets/')) console.log(`  dist/${file}`)
}

function redirectPage(to: string): string {
  let href = new URL(to, profile.url).href
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Redirecting to ${href}</title>
    <link rel="canonical" href="${href}">
    <meta name="robots" content="noindex">
    <meta http-equiv="refresh" content="0; url=${to}">
    <script>location.replace(${JSON.stringify(to)} + location.search + location.hash)</script>
  </head>
  <body>
    <a href="${to}">${href}</a>
  </body>
</html>
`
}
