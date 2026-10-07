import type { Handle, RemixNode } from 'remix/component'
import { css } from 'remix/component'

import { accomplishments, profile } from '../data/profile.ts'
import { formatDate, type Post } from '../data/posts.ts'
import { routes } from '../routes.ts'
import { Document } from '../ui/document.tsx'
import { LeaderList } from '../ui/leader-list.tsx'
import { displayStyle, labelStyle, leadStyle, quietLinkStyle } from '../ui/theme.ts'

export function HomePage(handle: Handle<{ posts: Post[] }>) {
  return () => {
    let recentPosts = handle.props.posts.slice(0, 3)

    return (
      <Document path={routes.home.href()}>
        <section aria-labelledby="intro" mix={css({ display: 'grid', gap: '20px' })}>
          <p mix={labelStyle}>Hi, I'm</p>
          <h1 id="intro" mix={displayStyle}>
            {profile.name}
          </h1>
          <p mix={leadStyle}>{profile.intro}</p>
        </section>

        <Section id="work" label="Selected work">
          <LeaderList
            items={accomplishments.map((item) => ({
              key: item.name,
              href: item.href,
              title: item.name,
              meta: item.year,
              metaDetail: item.stat,
              children: item.summary,
            }))}
          />
        </Section>

        {recentPosts.length > 0 ? (
          <Section
            id="writing"
            label="Writing"
            aside={
              <a href={routes.blog.index.href()} mix={[labelStyle, quietLinkStyle]}>
                All posts →
              </a>
            }
          >
            <LeaderList
              numbered={false}
              items={recentPosts.map((post) => ({
                key: post.slug,
                href: routes.blog.show.href({ slug: post.slug }),
                title: post.title,
                meta: formatDate(post.date),
              }))}
            />
          </Section>
        ) : null}
      </Document>
    )
  }
}

function Section(
  handle: Handle<{ id: string; label: string; aside?: RemixNode; children: RemixNode }>,
) {
  return () => {
    let { id, label, aside, children } = handle.props

    return (
      <section aria-labelledby={id} mix={css({ marginTop: '88px' })}>
        <div
          mix={css({
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            paddingBottom: '14px',
            marginBottom: '28px',
            borderBottom: '1px solid var(--rule)',
          })}
        >
          <h2 id={id} mix={labelStyle}>
            {label}
          </h2>
          {aside}
        </div>
        {children}
      </section>
    )
  }
}
