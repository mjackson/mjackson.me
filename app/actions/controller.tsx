import { createController } from 'remix/router'

import { getPosts } from '../data/posts.ts'
import { profile } from '../data/profile.ts'
import { routes } from '../routes.ts'
import { HomePage } from './home-page.tsx'

export default createController(routes, {
  actions: {
    async home(context) {
      return context.render(<HomePage posts={await getPosts()} />)
    },
    async feed() {
      let posts = (await getPosts()).filter((post) => !post.draft)
      return new Response(renderFeed(posts), {
        headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
      })
    },
  },
})

function renderFeed(posts: Awaited<ReturnType<typeof getPosts>>): string {
  let blogUrl = new URL(routes.blog.index.href(), profile.url).href
  let items = posts
    .map((post) => {
      let url = new URL(routes.blog.show.href({ slug: post.slug }), profile.url).href
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(profile.name)}</title>
    <link>${blogUrl}</link>
    <description>${escapeXml(profile.tagline)}</description>
${items}
  </channel>
</rss>
`
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
