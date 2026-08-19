/**
 * HashRouter on GitHub Pages: normalize the browser URL so home is always …/#/
 * (not the bare repo path without a hash).
 */
export function ensureHashRouterUrl(routePath?: string) {
  const { pathname, hash, search } = window.location
  const base = pathname.endsWith('/') ? pathname : `${pathname}/`

  if (!hash || hash === '#') {
    window.history.replaceState(null, '', `${base}${search}#/`)
    return
  }

  if (routePath === '/' && hash !== '#/') {
    window.history.replaceState(null, '', `${base}${search}#/`)
  }
}
