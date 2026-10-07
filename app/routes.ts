import { get, route } from 'remix/routes'

export const routes = route({
  home: get('/'),
  blog: route('/blog', {
    index: get('/'),
    show: get('/:slug'),
  }),
  feed: get('/feed.xml'),
})
