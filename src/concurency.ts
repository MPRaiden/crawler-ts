import pLimit from 'p-limit';
import { extractPageData, getURLsFromHTML, normalizeURL } from './crawl';
import { ExtractedPageData } from './types';


export class ConcurentCrawler {
  baseURL: string;
  pages: Record<string, ExtractedPageData> = {};
  limit: <T>(fn: () => Promise<T>) => Promise<T>;
  maxPages: number
  shouldStop: boolean
  allTasks: Set<Promise<void>>

  private visited = new Set<string>()

  constructor(url: string, maxConcurency: number = 3, maxPages: number = 3) {
    this.baseURL = url
    this.pages = {}
    this.limit = pLimit(maxConcurency)
    this.maxPages = maxPages
    this.shouldStop = false
    this.allTasks = new Set()
  }

  private abortController = new AbortController()

  private addPageVisit(normalizedURL: string): boolean {
    if (this.shouldStop) {
      return false
    }

    if (this.visited.has(normalizedURL)) {
      return false
    }

    if (this.visited.size >= this.maxPages) {
      this.shouldStop = true
      console.log("Reached maximum number of pages to crawl.")
      this.abortController.abort()
      return false
    }

    this.visited.add(normalizedURL)

    return true
  }

  private async getHTML(currentURL: string): Promise<string> {
    return await this.limit(async () => {
      try {
        const { signal } = this.abortController
        const res = await fetch(currentURL,
          { headers: { 'User-Agent': 'BootCrawler/1.0' }, signal, }
        )

        if (res.status >= 400) {
          console.error(`Response status code not ok, code -> ${res.status}`)
          return ""
        }

        if (!res.headers.get('content-type')?.includes('text/html')) {
          console.error(`Response content type not txt/html -> ${res.headers.get('content-type')}`)
          return ""
        }

        return await res.text()
      } catch (err) {
        console.error(`function getHTML() - Errored out:\n${err}`)
        return ""
      }
    })
  }

  private async crawlPage(currentURL: string): Promise<void> {
    if (this.shouldStop) {
      return
    }

    const baseURLDomain = new URL(this.baseURL).hostname
    const currentURLDomain = new URL(currentURL).hostname

    const normCurrentURL = normalizeURL(currentURL)

    if (baseURLDomain !== currentURLDomain) {
      return
    }

    const newPage = this.addPageVisit(normCurrentURL)
    if (!newPage) {
      return
    }

    const html = await this.getHTML(currentURL)
    if (!html) {
      return
    }
    const urls = getURLsFromHTML(html, this.baseURL)

    const data = extractPageData(html, currentURL)
    this.pages[normCurrentURL] = data

    const crawls = urls.map(url => {
      const crawlTask = this.crawlPage(url)
      this.allTasks.add(crawlTask)

      const wrapped = crawlTask.finally(() => {
        this.allTasks.delete(crawlTask)
      })

      return wrapped
    })

    await Promise.all(crawls)
  }

  async crawl(): Promise<Record<string, ExtractedPageData>> {
    const rootTask = this.crawlPage(this.baseURL)
    this.allTasks.add(rootTask)

    rootTask.finally(() => {
      this.allTasks.delete(rootTask)
    })


    await Promise.allSettled(this.allTasks)
    return this.pages
  }
}

export async function crawlSiteAsync(url: string, maxConcurency: number = 3, maxPages: number = 3): Promise<Record<string, ExtractedPageData>> {
  const crawler = new ConcurentCrawler(url, maxConcurency, maxPages)
  return await crawler.crawl()
}

