---
title: A new home, built with Remix 3
description: This site is a few hundred lines of Remix 3, ships zero client JavaScript, and follows your system's light or dark mode.
date: 2026-10-06
---

<!-- Starter post. Rewrite it, or delete this file and add your own in posts/. -->

Remix 3 shipped last week, so it felt like the right time to rebuild my own corner of the web with it.

The whole site is a handful of routes, a few components, and some Markdown files. There's no bundler and no build step for development. Node runs the TypeScript directly.

## Routes are just data

Every URL on the site comes from one route map:

```ts
import { get, route } from 'remix/routes'

export const routes = route({
  home: get('/'),
  blog: route('/blog', {
    index: get('/'),
    show: get('/:slug'),
  }),
  feed: get('/feed.xml'),
})
```

Links are generated from the same object, so `routes.blog.show.href({ slug })` is type-checked. If a URL changes, the compiler finds every link that needs to change with it.

## No JavaScript required

Nothing on this site needs to run in the browser, so nothing does. Components render on the server, and their styles are collected into the document head. Light and dark mode follow `prefers-color-scheme`, with no toggle and no flash.

When a page _does_ need interactivity, Remix hydrates only the components that ask for it, and the rest of the page stays plain HTML.

## What's next

More writing, mostly. Some things I want to get to:

1. What we learned rebuilding Remix on web APIs
2. Why the component model is setup + render
3. Notes from a decade of maintaining open source

If you want to follow along, there's an [RSS feed](/feed.xml), or you can find me [on X](https://x.com/mjackson).
