import type { Handle, RemixNode } from 'remix/component'
import { css } from 'remix/component'

import { mono } from './theme.ts'

export interface LeaderItem {
  key: string
  href: string
  title: string
  /** Right-aligned mono text, e.g. a date or year. */
  meta: string
  /** Optional muted line under the title. */
  children?: RemixNode
}

/**
 * A numbered list of links joined to their metadata by a dotted leader:
 *
 *   (01) React Router ··························· 2014
 */
export function LeaderList(handle: Handle<{ items: LeaderItem[]; numbered?: boolean }>) {
  return () => {
    let { items, numbered = true } = handle.props

    return (
      <ol mix={listStyle}>
        {items.map((item, index) => (
          <li key={item.key}>
            <a href={item.href} mix={rowStyle}>
              {numbered ? (
                <span mix={indexStyle}>({String(index + 1).padStart(2, '0')})</span>
              ) : null}
              <span mix={titleStyle}>{item.title}</span>
              <span aria-hidden="true" class="leader" mix={leaderStyle} />
              <span class="meta" mix={metaStyle}>
                {item.meta}
              </span>
            </a>
            {item.children ? (
              <p mix={[descriptionStyle, numbered ? indentedStyle : null]}>
                {item.children}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    )
  }
}

const listStyle = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: '22px',
})

const rowStyle = css({
  display: 'flex',
  alignItems: 'baseline',
  gap: '12px',
  color: 'var(--fg-strong)',
  textDecoration: 'none',
  fontSize: '16px',
  lineHeight: 1.5,
  '&:hover .leader': { borderColor: 'var(--fg-muted)' },
  '&:hover .meta': { color: 'var(--fg-strong)' },
})

const indexStyle = css({
  flex: '0 0 30px',
  fontFamily: mono,
  fontSize: '12px',
  fontVariantNumeric: 'tabular-nums',
  color: 'var(--fg-muted)',
})

const titleStyle = css({ fontWeight: 500, whiteSpace: 'nowrap' })

const leaderStyle = css({
  flex: '1 1 24px',
  minWidth: '24px',
  transform: 'translateY(-4px)',
  borderBottom: '1px dotted var(--rule-strong)',
  transition: 'border-color 150ms ease',
})

const metaStyle = css({
  flex: 'none',
  fontFamily: mono,
  fontSize: '12px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontVariantNumeric: 'tabular-nums',
  color: 'var(--fg-muted)',
  transition: 'color 150ms ease',
})

const descriptionStyle = css({
  margin: '4px 0 0',
  fontSize: '15px',
  lineHeight: 1.6,
  color: 'var(--fg-muted)',
  textWrap: 'pretty',
})

// Lines the description up with the title, past the (01) index column.
const indentedStyle = css({ paddingLeft: '42px' })
