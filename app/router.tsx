import { createRouter, type MiddlewareContext } from 'remix/router'
import { compression } from 'remix/middleware/compression'
import { render } from 'remix/middleware/render'
import { staticFiles } from 'remix/middleware/static'

import blogController from './actions/blog/controller.tsx'
import controller from './actions/controller.tsx'
import { NotFoundPage } from './actions/not-found-page.tsx'
import { routes } from './routes.ts'

// This site ships no browser JavaScript, so render() needs no asset server.
const renderMiddleware = render()
type AppContext = MiddlewareContext<[typeof renderMiddleware]>

declare module 'remix' {
  interface RouterTypes {
    context: AppContext
  }
}

export const router = createRouter<AppContext>({
  middleware: [compression(), staticFiles('./public', { index: false }), renderMiddleware],
  defaultHandler(context) {
    return context.render(<NotFoundPage />, { status: 404 })
  },
})

router.map(routes, controller)
router.map(routes.blog, blogController)
