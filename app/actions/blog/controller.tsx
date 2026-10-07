import { createController } from 'remix/router'

import { getPost, getPosts } from '../../data/posts.ts'
import { routes } from '../../routes.ts'
import { NotFoundPage } from '../not-found-page.tsx'
import { BlogIndexPage } from './index-page.tsx'
import { PostPage } from './post-page.tsx'

export default createController(routes.blog, {
  actions: {
    async index(context) {
      return context.render(<BlogIndexPage posts={await getPosts()} />)
    },
    async show(context) {
      let post = await getPost(context.params.slug)
      if (!post) return context.render(<NotFoundPage />, { status: 404 })
      return context.render(<PostPage post={post} />)
    },
  },
})
