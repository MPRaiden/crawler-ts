/**
Returns normalized url containing only hostname plus pathname.

@param {string} url - url string to normalize.
@returns {string} - normalized url string.
*/
export function normalizeURL(url: string): string {
  const urlObject = new URL(url)

  const hostname = urlObject.hostname
  const path = urlObject.pathname

  return `${hostname}${path}`
}

