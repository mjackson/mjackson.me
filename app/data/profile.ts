// Everything about me that shows up on the site lives here. Edit freely.

export const profile = {
  name: 'Michael Jackson',
  handle: 'mjackson',
  url: 'https://mjackson.me',
  tagline: 'I write a lot of code. Mostly for the web.',
  intro:
    'I lead the Remix project at Shopify. Before that I co-founded Remix Software, ' +
    'and before that I spent a decade building tools that a lot of the web runs on.',
  links: [
    { label: 'GitHub', href: 'https://github.com/mjackson' },
    { label: 'X', href: 'https://x.com/mjackson' },
    { label: 'npm', href: 'https://www.npmjs.com/~mjackson' },
  ],
}

export interface Accomplishment {
  name: string
  href: string
  year: string
  summary: string
  /** A short, verifiable stat. Shown in mono on the right. */
  stat?: string
}

// Stats checked October 2026 against the npm downloads API and GitHub.
export const accomplishments: Accomplishment[] = [
  {
    name: 'Remix',
    href: 'https://remix.run',
    year: '2020',
    summary:
      'Co-founded Remix Software with Ryan Florence. Shopify acquired it in 2022, and I now lead the project there. Remix 3 shipped in 2026.',
    stat: '33k stars',
  },
  {
    name: 'React Router',
    href: 'https://reactrouter.com',
    year: '2014',
    summary:
      'Co-created the routing library for React. More than a decade later it is still the way most React apps move between pages.',
    stat: '~70M / week',
  },
  {
    name: 'unpkg',
    href: 'https://unpkg.com',
    year: '2016',
    summary:
      'Built the CDN for everything on npm. Any file from any package, one URL away.',
  },
  {
    name: 'history',
    href: 'https://github.com/remix-run/history',
    year: '2015',
    summary: 'A small library for managing session history in JavaScript, everywhere.',
    stat: '~14M / week',
  },
  {
    name: 'expect',
    href: 'https://jestjs.io/docs/expect',
    year: '2015',
    summary:
      'Wrote the original expect assertion library, then handed the name to the Jest team, where it lives on.',
  },
  {
    name: 'React Training',
    href: 'https://reacttraining.com',
    year: '2015',
    summary: 'Co-founded a company that taught React to engineering teams around the world.',
  },
]
