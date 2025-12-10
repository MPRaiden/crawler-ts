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

