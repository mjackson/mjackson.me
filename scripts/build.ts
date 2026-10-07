// Prerenders every page to static files in dist/ so the site can be hosted on
// any static host. It's deployed to GitHub Pages by .github/workflows/deploy.yml.
//
//   npm run build
//
// The app itself is unchanged: we just ask the router for each URL.

import * as fs from 'node:fs/promises'
import * as path from 'node:path'

import { getPosts } from '../app/data/posts.ts'
import { router } from '../app/router.tsx'
import { routes } from '../app/routes.ts'

const outDir = path.resolve(import.meta.dirname, '../dist')
const publicDir = path.resolve(import.meta.dirname, '../public')

await fs.rm(outDir, { recursive: true, force: true })
await fs.cp(publicDir, outDir, { recursive: true })

let posts = await getPosts()

// Each entry is [url, output file]. GitHub Pages serves /foo from foo.html, so
// pages are written that way to keep URLs clean without trailing-slash
// redirects. The blog index is also written as blog/index.html in case /blog
// resolves to the blog/ directory first.
let pages: Array<[string, string]> = [
  [routes.home.href(), 'index.html'],
  [routes.blog.index.href(), 'blog.html'],
  [routes.blog.index.href(), 'blog/index.html'],
  ...posts.map((post): [string, string] => [
    routes.blog.show.href({ slug: post.slug }),
    `blog/${post.slug}.html`,
  ]),
  [routes.feed.href(), 'feed.xml'],
  ['/__not-found__', '404.html'],
]

for (let [url, file] of pages) {
  let response = await router.fetch(new URL(url, 'http://localhost'))
  let expected = file === '404.html' ? 404 : 200
  if (response.status !== expected) {
    throw new Error(`GET ${url} returned ${response.status}, expected ${expected}`)
  }

  let target = path.join(outDir, file)
  await fs.mkdir(path.dirname(target), { recursive: true })
  await fs.writeFile(target, await response.text())
  console.log(`  ${url.padEnd(40)} → dist/${file}`)
}

console.log(`\nBuilt ${pages.length} pages into dist/`)
