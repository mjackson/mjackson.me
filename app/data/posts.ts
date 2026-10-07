import * as fs from 'node:fs/promises'
import * as path from 'node:path'

import { Marked } from 'marked'
import { createHighlighter, type BundledLanguage } from 'shiki'

export interface Post {
  slug: string
  title: string
  description: string
  /** ISO date, e.g. 2026-10-06 */
  date: string
  draft: boolean
  html: string
  readingMinutes: number
}

const postsDir = path.resolve(import.meta.dirname, '../../posts')
const isProduction = process.env.NODE_ENV === 'production'

const languages: BundledLanguage[] = [
  'ts',
  'tsx',
  'js',
  'jsx',
  'json',
  'css',
  'html',
  'sh',
  'diff',
  'md',
]

const highlighter = await createHighlighter({
  themes: ['github-light', 'github-dark-default'],
  langs: languages,
})

const marked = new Marked({
  gfm: true,
  renderer: {
    code({ text, lang }) {
      let language = (lang ?? '').split(/\s/)[0]
      if (!highlighter.getLoadedLanguages().includes(language)) language = 'text'

      return highlighter.codeToHtml(text, {
        lang: language,
        themes: { light: 'github-light', dark: 'github-dark-default' },
        // Colors come from CSS variables so light/dark follows the page.
        defaultColor: false,
      })
    },
  },
})

let cache: Promise<Post[]> | undefined

/** All published posts, newest first. Drafts are included outside production. */
export function getPosts(): Promise<Post[]> {
  // Re-read on every request in development so edits show up on refresh.
  if (!isProduction || !cache) cache = loadPosts()
  return cache
}

export async function getPost(slug: string): Promise<Post | undefined> {
  let posts = await getPosts()
  return posts.find((post) => post.slug === slug)
}

async function loadPosts(): Promise<Post[]> {
  let files = (await fs.readdir(postsDir)).filter((file) => file.endsWith('.md'))

  let posts = await Promise.all(
    files.map(async (file) => {
      let source = await fs.readFile(path.join(postsDir, file), 'utf8')
      return parsePost(file.replace(/\.md$/, ''), source)
    }),
  )

  return posts
    .filter((post) => !(isProduction && post.draft))
    .sort((a, b) => b.date.localeCompare(a.date))
}

async function parsePost(slug: string, source: string): Promise<Post> {
  let { data, body } = parseFrontmatter(source)

  if (!data.title || !data.date) {
    throw new Error(`posts/${slug}.md needs a "title" and "date" in its frontmatter`)
  }

  let words = body.split(/\s+/).filter(Boolean).length

  return {
    slug,
    title: data.title,
    description: data.description ?? '',
    date: data.date,
    draft: data.draft === 'true',
    html: await marked.parse(body),
    readingMinutes: Math.max(1, Math.round(words / 230)),
  }
}

/** Parses simple `key: value` frontmatter between `---` fences. */
function parseFrontmatter(source: string): { data: Record<string, string>; body: string } {
  let match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source)
  if (!match) return { data: {}, body: source }

  let data: Record<string, string> = {}
  for (let line of match[1].split(/\r?\n/)) {
    let index = line.indexOf(':')
    if (index === -1) continue
    let key = line.slice(0, index).trim()
    let value = line.slice(index + 1).trim().replace(/^(['"])(.*)\1$/, '$2')
    data[key] = value
  }

  return { data, body: source.slice(match[0].length) }
}

export function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
