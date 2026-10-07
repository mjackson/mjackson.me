import { css } from 'remix/component'

import { routes } from '../routes.ts'
import { Document } from '../ui/document.tsx'
import { displayStyle, labelStyle, leadStyle, quietLinkStyle } from '../ui/theme.ts'

export function NotFoundPage() {
  return () => (
    <Document title="Not found" path="/404">
      <section mix={css({ display: 'grid', gap: '20px' })}>
        <p mix={labelStyle}>404</p>
        <h1 mix={displayStyle}>Nothing here.</h1>
        <p mix={leadStyle}>
          That page doesn't exist, or it moved.{' '}
          <a
            href={routes.home.href()}
            mix={[quietLinkStyle, css({ color: 'var(--fg-strong)', textDecoration: 'underline', textUnderlineOffset: '4px' })]}
          >
            Head home
          </a>
          .
        </p>
      </section>
    </Document>
  )
}
