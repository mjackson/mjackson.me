import type { Handle } from 'remix/component'
import { css } from 'remix/component'

import { formatDate, type Post } from '../../data/posts.ts'
import { routes } from '../../routes.ts'
import { Document } from '../../ui/document.tsx'
import { LeaderList } from '../../ui/leader-list.tsx'
import { displayStyle, labelStyle, leadStyle } from '../../ui/theme.ts'

export function BlogIndexPage(handle: Handle<{ posts: Post[] }>) {
  return () => {
    let { posts } = handle.props

    return (
      <Document
        title="Blog"
        description="Notes on the web, JavaScript, and building Remix."
        path={routes.blog.index.href()}
      >
        <header mix={css({ display: 'grid', gap: '20px', marginBottom: '64px' })}>
          <p mix={labelStyle}>Blog</p>
          <h1 mix={displayStyle}>Writing</h1>
          <p mix={leadStyle}>Notes on the web, JavaScript, and building Remix.</p>
        </header>

        {posts.length > 0 ? (
          <LeaderList
            numbered={false}
            items={posts.map((post) => ({
              key: post.slug,
              href: routes.blog.show.href({ slug: post.slug }),
              title: post.draft ? `${post.title} (draft)` : post.title,
              meta: formatDate(post.date),
              children: post.description || undefined,
            }))}
          />
        ) : (
          <p mix={leadStyle}>Nothing here yet.</p>
        )}
      </Document>
    )
  }
}
