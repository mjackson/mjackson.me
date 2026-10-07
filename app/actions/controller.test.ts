import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import * as path from 'node:path'

import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { getPosts } from '../data/posts.ts'
import { redirects } from '../data/redirects.ts'
import { router } from '../router.tsx'
import { routes } from '../routes.ts'

function get(href: string) {
  return router.fetch(new URL(href, 'http://localhost'))
}

/** Runs `fn` with an empty posts directory instead of the fixtures. */
async function withNoPosts<T>(fn: () => Promise<T>): Promise<T> {
  let previous = process.env.POSTS_DIR
  let dir = await fs.mkdtemp(path.join(os.tmpdir(), 'no-posts-'))
  process.env.POSTS_DIR = dir
  try {
    return await fn()
  } finally {
    // Assigning undefined to process.env stores the string "undefined".
    if (previous === undefined) delete process.env.POSTS_DIR
    else process.env.POSTS_DIR = previous
    await fs.rm(dir, { recursive: true, force: true })
  }
}

describe('site', () => {
  it('GET / renders the home page with no client scripts', async () => {
    let response = await get(routes.home.href())
    let html = await response.text()

    assert.equal(response.status, 200)
    assert.match(response.headers.get('Content-Type') ?? '', /text\/html/)
    assert.match(html, /Michael Jackson/)
    assert.doesNotMatch(html, /<script/)
  })

  it('GET / lists writing above selected work', async () => {
    let html = await (await get(routes.home.href())).text()
    let writing = html.indexOf('Writing</h2>')
    let work = html.indexOf('Selected work</h2>')

    assert.ok(writing !== -1, 'expected a Writing section')
    assert.ok(work !== -1, 'expected a Selected work section')
    assert.ok(writing < work, 'expected Writing before Selected work')
  })

  it('GET / hides the writing list when there are no posts', async () => {
    let html = await withNoPosts(async () => (await get(routes.home.href())).text())

    assert.doesNotMatch(html, /Writing<\/h2>/)
    assert.match(html, /Selected work<\/h2>/)
  })

  it('GET /blog says so when there are no posts', async () => {
    let html = await withNoPosts(async () => (await get(routes.blog.index.href())).text())

    assert.match(html, /Nothing here yet/)
  })

  it('GET /blog lists every post', async () => {
    let response = await get(routes.blog.index.href())
    let html = await response.text()

    assert.equal(response.status, 200)
    for (let post of await getPosts()) {
      assert.ok(html.includes(routes.blog.show.href({ slug: post.slug })), post.slug)
    }
  })

  it('GET /blog/:slug renders a post', async () => {
    let [post] = await getPosts()
    let response = await get(routes.blog.show.href({ slug: post.slug }))

    assert.equal(response.status, 200)
    assert.ok((await response.text()).includes(post.title))
  })

  it('returns a 404 page for unknown posts and URLs', async () => {
    assert.equal((await get(routes.blog.show.href({ slug: 'nope' }))).status, 404)
    assert.equal((await get('/does/not/exist')).status, 404)
  })

  it('GET /calc renders the calculator and its browser modules load', async () => {
    let response = await get(routes.calc.href())
    let html = await response.text()

    assert.equal(response.status, 200)
    assert.match(html, /<title>Calculator<\/title>/)

    // What the browser loads: the entry script, module preloads, and the
    // hydrated component. (Import map keys are stable URLs that aren't served.)
    let scripts = [...html.matchAll(/(?:src|href|"moduleUrl")[=:]"(\/assets\/[^"]+)"/g)].map(
      (match) => match[1],
    )
    assert.ok(scripts.length > 0, 'expected the page to load browser modules')
    for (let src of new Set(scripts)) {
      let module = await get(src)
      assert.equal(module.status, 200, src)
      assert.match(module.headers.get('Content-Type') ?? '', /javascript/, src)
    }
  })

  it('redirects old calculator URLs to /calc', async () => {
    for (let path of Object.keys(redirects)) {
      let response = await get(path)
      assert.equal(response.status, 301, path)
      assert.equal(new URL(response.headers.get('Location')!).pathname, routes.calc.href(), path)
    }
  })

  it('GET /feed.xml returns RSS', async () => {
    let response = await get(routes.feed.href())

    assert.equal(response.status, 200)
    assert.match(response.headers.get('Content-Type') ?? '', /rss\+xml/)
    assert.match(await response.text(), /<rss version="2.0">/)
  })
})
