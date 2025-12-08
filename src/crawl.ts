import { JSDOM } from 'jsdom'
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

/**
Returns first h1 element from html provided string input.

@param {string} html - html string input to extract h1 element text content from.
@returns {string} - either first h1 text contents or empty string if no h1 in HTML.
*/
export function getFirstH1FromHtml(html: string): string {
  const dom = new JSDOM(html)
  const firstH1 = dom.window.document.querySelector("h1")?.textContent

  if (!firstH1) {
    return ""
  }

  return firstH1
}

/**
Returns first paragraph inside main if it exists, if not looks for it outside. If it finds it returns that and if not returns empty string.

@param {string} html - htlm string input to extract paragraph from.
@returns {string} - extracted paragraph or empty string.
*/
export function getFirstParagraphFromHTML(html: string): string {
  const dom = new JSDOM(html)

  const main = dom.window.document.querySelector("main")
  const firstParagraph = main?.querySelector("p")

  if (firstParagraph) return firstParagraph.textContent

  const firstParOutsideMain = dom.window.document.querySelector("p")

  if (firstParOutsideMain) return firstParOutsideMain.textContent

  return ""
}

