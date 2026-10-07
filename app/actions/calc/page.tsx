import { css } from 'remix/component'
import { ImportMap } from 'remix/component/server'

import { scriptEntry } from '../../assets.ts'
import { profile } from '../../data/profile.ts'
import { routes } from '../../routes.ts'
import { Calculator } from './public/calculator.tsx'

const sourceUrl =
  'https://github.com/mjackson/mjackson.me/blob/main/app/actions/calc/public/calculator.tsx'

// Standalone, like the original: just the calculator on a gray backdrop.
export function CalcPage() {
  return () => {
    let { href, importMap, preloads } = scriptEntry

    return (
      <html lang="en" mix={rootStyle}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#666677" />
          <title>Calculator</title>
          <meta name="description" content="A calculator, built with Remix." />
          <link rel="canonical" href={new URL(routes.calc.href(), profile.url).href} />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap"
          />
          <ImportMap value={importMap} />
          {preloads.map((preloadHref) => (
            <link key={preloadHref} rel="modulepreload" href={preloadHref} />
          ))}
          <script type="module" src={href}></script>
        </head>
        <body>
          <main mix={wrapperStyle}>
            <div mix={css({ width: '320px', height: '520px', position: 'relative' })}>
              <Calculator />
            </div>
            <a href={sourceUrl} mix={sourceLinkStyle}>
              view source
            </a>
          </main>
        </body>
      </html>
    )
  }
}

const rootStyle = css({
  boxSizing: 'border-box',
  '& *, & *::before, & *::after': { boxSizing: 'inherit' },
  '& body': { margin: 0, font: "100 14px 'Roboto', sans-serif", background: '#667' },
})

const wrapperStyle = css({
  minHeight: '100svh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '20px',
  padding: '20px 0',
})

const sourceLinkStyle = css({
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: '12px',
  letterSpacing: '0.08em',
  color: 'rgba(255, 255, 255, 0.55)',
  textDecoration: 'none',
  '&:hover': { color: 'white' },
})
