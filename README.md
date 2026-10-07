# mjackson.me

The source for my personal site, [mjackson.me](https://mjackson.me). It's built with [Remix 3](https://remix.run). Blog posts are Markdown files in `posts/`.

## Running locally

Requires Node 24.3 or later.

```sh
npm install
npm run dev        # http://localhost:44100
npm test
npm run typecheck
npm run build      # static site in dist/
```

## Deployment

Every push to `main` runs the tests, prerenders the site to static files with `npm run build`, and publishes them to GitHub Pages.
