import { css } from 'remix/component'

export const sans = "Geist, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
export const mono = "'Geist Mono', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace"

const light = {
  '--bg': '#ffffff',
  '--fg': '#3f3f46',
  '--fg-strong': '#09090b',
  '--fg-muted': '#71717a',
  '--rule': '#e4e4e7',
  '--rule-strong': '#d4d4d8',
  '--code-bg': '#fafafa',
  '--selection': '#e4e4e7',
}

const dark = {
  '--bg': '#000000',
  '--fg': '#d4d4d8',
  '--fg-strong': '#fafafa',
  '--fg-muted': '#71717a',
  '--rule': '#27272a',
  '--rule-strong': '#3f3f46',
  '--code-bg': '#0a0a0b',
  '--selection': '#3f3f46',
}

/** Applied to <html>. Tokens follow the OS color scheme; there is no toggle. */
export const rootStyle = css({
  ...light,
  '@media (prefers-color-scheme: dark)': dark,
  colorScheme: 'light dark',
  background: 'var(--bg)',
  color: 'var(--fg)',
  fontFamily: sans,
  fontSize: '16px',
  lineHeight: 1.5,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  textRendering: 'optimizeLegibility',
  '& *, & *::before, & *::after': { boxSizing: 'border-box' },
  '& body': { margin: 0, minHeight: '100svh', background: 'var(--bg)' },
  '& ::selection': { background: 'var(--selection)', color: 'var(--fg-strong)' },
  '& :focus-visible': {
    outline: '2px solid var(--fg-strong)',
    outlineOffset: '3px',
    borderRadius: '2px',
  },
})

/** The single centered column every page lives in. */
export const columnStyle = css({
  width: '100%',
  maxWidth: '42rem',
  marginInline: 'auto',
  paddingInline: '20px',
})

/** Small uppercase mono label, e.g. dates and section headings. */
export const labelStyle = css({
  margin: 0,
  fontFamily: mono,
  fontSize: '12px',
  lineHeight: '16px',
  fontWeight: 400,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'var(--fg-muted)',
})

/** Big, tightly tracked display heading. */
export const displayStyle = css({
  margin: 0,
  fontSize: 'clamp(40px, 9vw, 64px)',
  lineHeight: 1,
  fontWeight: 600,
  letterSpacing: '-0.045em',
  color: 'var(--fg-strong)',
  textWrap: 'balance',
})

/** Muted lead paragraph under a heading. */
export const leadStyle = css({
  margin: 0,
  maxWidth: '36rem',
  fontSize: '18px',
  lineHeight: 1.6,
  color: 'var(--fg-muted)',
  textWrap: 'pretty',
})

/** Plain text link that brightens on hover. */
export const quietLinkStyle = css({
  color: 'inherit',
  textDecoration: 'none',
  transition: 'color 150ms ease',
  '&:hover': { color: 'var(--fg-strong)' },
})

/** Underlined link inside running text, matching links in posts. */
export const inlineLinkStyle = css({
  color: 'var(--fg-strong)',
  textDecorationLine: 'underline',
  textDecorationThickness: '1px',
  textDecorationColor: 'var(--rule-strong)',
  textUnderlineOffset: '4px',
  transition: 'text-decoration-color 150ms ease',
  '&:hover': { textDecorationColor: 'var(--fg-strong)' },
})

/** Long-form Markdown content. */
export const proseStyle = css({
  fontSize: '18px',
  lineHeight: 1.75,
  color: 'var(--fg)',
  textWrap: 'pretty',
  overflowWrap: 'break-word',

  '& > :first-child': { marginTop: 0 },
  '& p, & ul, & ol, & blockquote, & pre, & table, & figure': {
    marginBlock: '0 24px',
  },

  '& h2, & h3, & h4': {
    color: 'var(--fg-strong)',
    fontWeight: 600,
    textWrap: 'balance',
    scrollMarginTop: '24px',
  },
  '& h2': {
    fontSize: '28px',
    lineHeight: 1.3,
    letterSpacing: '-0.03em',
    margin: '56px 0 20px',
  },
  '& h3': {
    fontSize: '21px',
    lineHeight: 1.4,
    letterSpacing: '-0.02em',
    margin: '40px 0 12px',
  },
  '& h4': { fontSize: '18px', margin: '32px 0 8px' },

  '& a': {
    color: 'var(--fg-strong)',
    fontWeight: 500,
    textDecorationLine: 'underline',
    textDecorationThickness: '1px',
    textDecorationColor: 'var(--rule-strong)',
    textUnderlineOffset: '4px',
    transition: 'text-decoration-color 150ms ease',
  },
  '& a:hover': { textDecorationColor: 'var(--fg-strong)' },

  '& strong': { color: 'var(--fg-strong)', fontWeight: 600 },

  '& ul, & ol': { paddingLeft: '1.25em' },
  '& li': { marginBlock: '6px', paddingLeft: '4px' },
  '& li::marker': { color: 'var(--fg-muted)' },
  '& ol li::marker': { fontFamily: mono, fontSize: '0.85em' },

  '& blockquote': {
    margin: '0 0 24px',
    paddingLeft: '20px',
    borderLeft: '2px solid var(--rule-strong)',
    color: 'var(--fg-muted)',
  },

  '& hr': {
    border: 0,
    borderTop: '1px solid var(--rule)',
    margin: '48px 0',
  },

  '& img': { maxWidth: '100%', height: 'auto', borderRadius: '8px' },

  '& :not(pre) > code': {
    fontFamily: mono,
    fontSize: '0.85em',
    padding: '0.15em 0.35em',
    borderRadius: '4px',
    background: 'var(--code-bg)',
    border: '1px solid var(--rule)',
    color: 'var(--fg-strong)',
  },

  '& pre': {
    fontFamily: mono,
    fontSize: '14px',
    lineHeight: 1.7,
    padding: '18px 20px',
    border: '1px solid var(--rule)',
    borderRadius: '10px',
    background: 'var(--code-bg) !important',
    overflowX: 'auto',
    tabSize: 2,
  },
  '& pre code': { fontFamily: 'inherit' },
  // Shiki emits both themes as CSS variables; pick one per color scheme.
  '& .shiki span': { color: 'var(--shiki-light)' },
  '@media (prefers-color-scheme: dark)': {
    '& .shiki span': { color: 'var(--shiki-dark)' },
  },

  '& table': {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '15px',
    display: 'block',
    overflowX: 'auto',
  },
  '& th, & td': {
    textAlign: 'left',
    padding: '10px 12px 10px 0',
    borderBottom: '1px solid var(--rule)',
  },
  '& th': {
    fontFamily: mono,
    fontSize: '12px',
    fontWeight: 400,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--fg-muted)',
  },
})
