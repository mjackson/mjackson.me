import { createRouter, type MiddlewareContext } from 'remix/router'
import { compression } from 'remix/middleware/compression'
import { render } from 'remix/middleware/render'
import { staticFiles } from 'remix/middleware/static'

import { assets } from './assets.ts'
import blogController from './actions/blog/controller.tsx'
import controller from './actions/controller.tsx'
import { NotFoundPage } from './actions/not-found-page.tsx'
import { redirects } from './data/redirects.ts'
import { routes } from './routes.ts'

// The asset server resolves clientEntry() components to browser module URLs.
const renderMiddleware = render({ assets })
type AppContext = MiddlewareContext<[typeof renderMiddleware]>

declare module 'remix' {
  interface RouterTypes {
    context: AppContext
  }
}

export const router = createRouter<AppContext>({
  middleware: [
    compression(),
    (context, next) => {
      let target = redirects[context.url.pathname]
      return target ? Response.redirect(new URL(target, context.url), 301) : next()
    },
    staticFiles('./public', { index: false }),
    renderMiddleware,
  ],
  defaultHandler(context) {
    return context.render(<NotFoundPage />, { status: 404 })
  },
})

router.map(routes, controller)
router.map(routes.blog, blogController)
