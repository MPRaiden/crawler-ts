import pLimit from 'p-limit';
import { getURLsFromHTML, normalizeURL } from './crawl';

export class ConcurentCrawler {
  baseURL: string;
  pages: Record<string, number> = {};
  limit: Function;

  private addPageVisit(normalizedURL: string): boolean {
    if (Object.keys(this.pages).includes(normalizedURL)) {
      this.pages[normalizedURL]++
      return false
    } else {
      this.pages[normalizedURL] = 1
      return true
    }
  }

  private async getHTML(currentURL: string): Promise<string> {
    return await this.limit(async () => {
      try {
        const res = await fetch(currentURL,
          { headers: { 'User-Agent': 'BootCrawler/1.0' } }
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
      }
    })
  }

  private async crawlPage(currentURL: string): Promise<void> {
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


    const crawls = urls.map(url => this.crawlPage(url))
    await Promise.all(crawls)
  }

  async crawl() {
    await this.crawlPage(this.baseURL)
    return this.pages
  }

  constructor(url: string, maxConcurency: number) {
    this.baseURL = url
    this.pages = {}
    this.limit = pLimit(maxConcurency)
  }
}

