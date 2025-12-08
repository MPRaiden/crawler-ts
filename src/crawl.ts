export function normalizeURL(url: string) {
  const urlObject = new URL(url)

  const hostname = urlObject.hostname
  const path = urlObject.pathname

  return `${hostname}${path}`
}

