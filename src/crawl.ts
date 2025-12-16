import { JSDOM } from 'jsdom'
import { ExtractedPageData } from './types'

/**
Returns normalized url containing only hostname plus pathname.

@param {string} url - url string to normalize.
@returns {string} - normalized url string.
*/
export function normalizeURL(url: string): string {
  const urlObject = new URL(url)

  const hostname = urlObject.hostname
  let path = urlObject.pathname

  if (path !== "/" && path.endsWith("/")) {
    path = path.slice(0, -1)
  }

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

export function getURLsFromHTML(html: string, baseURL: string): string[] {
  const urls: string[] = []
  const dom = new JSDOM(html)
  const anchors = dom.window.document.querySelectorAll("a")

  for (const anchor of anchors) {
    const hrefValue = anchor.getAttribute("href")
    if (!hrefValue) continue

    try {
      const absURL = new URL(hrefValue, baseURL).toString()
      urls.push(absURL)
    } catch (err) {
      console.error(`invalid href -> ${hrefValue}. Error:\n${err}`)
    }
  }

  return urls
}

export function getIMGsFromHTML(html: string, baseURL: string): string[] {
  const urls: string[] = []
  const dom = new JSDOM(html)
  const imgs = dom.window.document.querySelectorAll("img")

  for (const img of imgs) {
    const imgSrc = img.getAttribute("src")
    if (!imgSrc) continue

    try {
      const absURL = new URL(imgSrc, baseURL).toString()
      urls.push(absURL)
    } catch (err) {
      console.error(`invalid img source -> ${imgSrc}. Error:\n${err}`)
    }
  }

  return urls
}

export function extractPageData(html: string, pageURL: string): ExtractedPageData {
  return {
    url: pageURL,
    h1: getFirstH1FromHtml(html),
    first_paragraph: getFirstParagraphFromHTML(html),
    outgoing_links: getURLsFromHTML(html, pageURL),
    image_urls: getIMGsFromHTML(html, pageURL)
  }
}

export async function getHTML(url: string) {
  try {
    const res = await fetch(url,
      { headers: { 'User-Agent': 'BootCrawler/1.0' } }
    )

    if (res.status >= 400) {
      console.error(`Response status code not ok, code -> ${res.status}`)
      return
    }

    if (!res.headers.get('content-type')?.includes('text/html')) {
      console.error(`Response content type not txt/html -> ${res.headers.get('content-type')}`)
      return
    }

    return await res.text()
  } catch (err) {
    console.error(`function getHTML() - Errored out:\n${err}`)
  }
}

export async function crawlPage(
  baseURL: string,
  currentURL: string = baseURL,
  pages: Record<string, number> = {},
) {
  const baseURLDomain = new URL(baseURL).hostname
  const currentURLDomain = new URL(currentURL).hostname

  const normCurrentURL = normalizeURL(currentURL)

  if (baseURLDomain !== currentURLDomain) {
    return pages
  }

  if (Object.keys(pages).includes(normCurrentURL)) {
    pages[normCurrentURL]++
    // Since this url was already seen, we dont need to crawl it again so we return the pages
    return pages
  } else {
    pages[normCurrentURL] = 1
  }

  const html = await getHTML(currentURL)
  if (!html) {
    return pages
  }

  const urls = getURLsFromHTML(html, currentURL)

  for (let i = 0; i < urls.length; i++) {
    pages = await crawlPage(baseURL, urls[i], pages)
  }

  return pages
}

