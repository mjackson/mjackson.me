import type { Handle, RemixNode } from 'remix/component'
import { css } from 'remix/component'

import { profile } from '../data/profile.ts'
import { routes } from '../routes.ts'
import { columnStyle, mono, quietLinkStyle, rootStyle } from './theme.ts'

export interface DocumentProps {
  children?: RemixNode
  /** Page title. The site name is appended unless this is the home page. */
  title?: string
  description?: string
  /** Path of this page, used for the canonical URL. */
  path: string
  /** Open Graph type. */
  type?: 'website' | 'article'
}

export function Document(handle: Handle<DocumentProps>) {
  return () => {
    let { children, title, description = profile.tagline, path, type = 'website' } = handle.props
    let fullTitle = title ? `${title} · ${profile.name}` : `${profile.name} (@${profile.handle})`
    let canonical = new URL(path, profile.url).href

    return (
      <html lang="en" mix={rootStyle}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="color-scheme" content="light dark" />
          <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
          <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
          <title>{fullTitle}</title>
          <meta name="description" content={description} />
          <link rel="canonical" href={canonical} />
          <meta property="og:type" content={type} />
          <meta property="og:title" content={title ?? profile.name} />
          <meta property="og:description" content={description} />
          <meta property="og:url" content={canonical} />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:creator" content={`@${profile.handle}`} />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link
            rel="alternate"
            type="application/rss+xml"
            title={`${profile.name}'s blog`}
            href={routes.feed.href()}
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap"
          />
        </head>
        <body>
          <div
            mix={css({
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100svh',
            })}
          >
            <SiteHeader />
            <main mix={[columnStyle, css({ flex: 1, paddingBlock: '72px 96px' })]}>
              {children}
            </main>
            <SiteFooter />
          </div>
        </body>
      </html>
    )
  }
}

function SiteHeader() {
  return () => (
    <header
      mix={[
        columnStyle,
        css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBlock: '28px',
          fontFamily: mono,
          fontSize: '13px',
          color: 'var(--fg-muted)',
        }),
      ]}
    >
      <a
        href={routes.home.href()}
        mix={[quietLinkStyle, css({ color: 'var(--fg-strong)' })]}
      >
        @{profile.handle}
      </a>
      <nav aria-label="Primary" mix={css({ display: 'flex', gap: '20px' })}>
        <a href={routes.blog.index.href()} mix={quietLinkStyle}>
          blog
        </a>
        <a href="https://github.com/mjackson" mix={quietLinkStyle}>
          github
        </a>
      </nav>
    </header>
  )
}

function SiteFooter() {
  return () => (
    <footer
      mix={[
        columnStyle,
        css({
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px 20px',
          justifyContent: 'space-between',
          paddingBlock: '32px 40px',
          borderTop: '1px solid var(--rule)',
          fontFamily: mono,
          fontSize: '12px',
          color: 'var(--fg-muted)',
        }),
      ]}
    >
      <span>
        © {new Date().getFullYear()} {profile.name}
      </span>
      <nav aria-label="Elsewhere" mix={css({ display: 'flex', gap: '16px' })}>
        {profile.links.map((link) => (
          <a key={link.href} href={link.href} mix={quietLinkStyle}>
            {link.label.toLowerCase()}
          </a>
        ))}
        <a href={routes.feed.href()} mix={quietLinkStyle}>
          rss
        </a>
      </nav>
    </footer>
  )
}
