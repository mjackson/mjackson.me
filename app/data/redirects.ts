import { routes } from '../routes.ts'

/**
 * Old URLs that should keep working. The Node server answers these with a 301;
 * the static build writes a small redirect page at each path, since GitHub
 * Pages can't send real redirects.
 */
export const redirects: Record<string, string> = {
  // The calculator lived at /calculator/ in 2016-2017, then at /calc/.
  '/calculator': routes.calc.href(),
  '/calculator/': routes.calc.href(),
  '/calculator/index.html': routes.calc.href(),
  '/calc/': routes.calc.href(),
  '/calc/index.html': routes.calc.href(),
}
