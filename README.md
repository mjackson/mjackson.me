# mjackson.me

My personal site. Built with [Remix 3](https://remix.run), with no client-side JavaScript.

```sh
npm install
npm run dev        # http://localhost:44100, restarts on changes to app/ and posts/
npm test
npm run typecheck
```

## Writing

Posts are Markdown files in `posts/`. The file name is the URL slug.

```md
---
title: My post
description: One sentence, used on the blog index, in RSS, and in link previews.
date: 2026-10-06
draft: true
---

Hello.
```

`draft: true` posts show up in development but are left out of production builds and the feed. Code fences get syntax highlighting at render time, and the colors follow light/dark mode.

The intro and the "Selected work" list come from `app/data/profile.ts`.

## Layout

```
app/
  routes.ts               every URL on the site
  router.tsx              middleware, old-URL redirects, 404
  assets.ts               compiles browser modules (only /calc uses any)
  actions/                controllers and pages, one folder per route map
  actions/calc/           the calculator, ported from the 2017 site
  data/posts.ts           Markdown loading, frontmatter, highlighting
  data/profile.ts         bio, links, accomplishments
  data/redirects.ts       old URLs → new URLs
  ui/theme.ts             color tokens, type, and prose styles
  ui/document.tsx         <html> shell, header, footer
  ui/leader-list.tsx      the numbered "name ····· meta" lists
posts/                    blog posts
public/                   served as-is
scripts/build.ts          prerenders pages, browser modules, and redirects into dist/
```

## Deploying

Every push to `main` runs `.github/workflows/deploy.yml`. It typechecks, runs the tests, prerenders the site into `dist/` with `npm run build`, and publishes that folder to GitHub Pages at [mjackson.me](https://mjackson.me).

The custom domain is set under the repo's Settings → Pages. DNS lives in Cloudflare:

| Type  | Name  | Value                                                             |
| ----- | ----- | ----------------------------------------------------------------- |
| A     | `@`   | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| AAAA  | `@`   | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
| CNAME | `www` | `mjackson.github.io`                                              |

Keep the records **DNS only** (gray cloud) so GitHub can issue the HTTPS certificate.

To check a production build locally, run `npm run build` and serve `dist/` with any static file server. `npm start` also runs the same app as a Node server.
