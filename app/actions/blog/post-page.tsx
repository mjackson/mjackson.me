import type { Handle } from 'remix/component'
import { css, unsafeHTML } from 'remix/component'

import { formatDate, type Post } from '../../data/posts.ts'
import { profile } from '../../data/profile.ts'
import { routes } from '../../routes.ts'
import { Document } from '../../ui/document.tsx'
import { labelStyle, leadStyle, proseStyle, quietLinkStyle } from '../../ui/theme.ts'

export function PostPage(handle: Handle<{ post: Post }>) {
  return () => {
    let { post } = handle.props

    return (
      <Document
        title={post.title}
        description={post.description || undefined}
        path={routes.blog.show.href({ slug: post.slug })}
        type="article"
      >
        <article>
          <header mix={css({ display: 'grid', gap: '20px', marginBottom: '56px' })}>
            <p
              mix={[
                labelStyle,
                css({ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '8px' }),
              ]}
            >
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>
                {post.draft ? 'Draft · ' : ''}
                {post.readingMinutes} min read
              </span>
            </p>
            <h1
              mix={css({
                margin: 0,
                fontSize: 'clamp(34px, 6vw, 44px)',
                lineHeight: 1.1,
                fontWeight: 600,
                letterSpacing: '-0.04em',
                color: 'var(--fg-strong)',
                textWrap: 'balance',
              })}
            >
              {post.title}
            </h1>
            {post.description ? <p mix={leadStyle}>{post.description}</p> : null}
          </header>

          {/* Post HTML comes from Markdown files in this repo, so it is trusted. */}
          <div mix={proseStyle} innerHTML={unsafeHTML(post.html)} />
        </article>

        <nav
          aria-label="Post"
          mix={css({
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px',
            marginTop: '80px',
            paddingTop: '20px',
            borderTop: '1px solid var(--rule)',
          })}
        >
          <a href={routes.blog.index.href()} mix={[labelStyle, quietLinkStyle]}>
            ← All posts
          </a>
          <a href={`https://x.com/${profile.handle}`} mix={[labelStyle, quietLinkStyle]}>
            @{profile.handle} on X
          </a>
        </nav>
      </Document>
    )
  }
}
