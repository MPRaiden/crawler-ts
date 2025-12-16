import pLimit from 'p-limit';

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

  // private async getHTML(currentURL: string): Promise<string> {

  // }

  constructor(url: string, pages: Record<string, number>, maxConcurency: number) {
    this.baseURL = url
    this.pages = pages
    this.limit = pLimit(maxConcurency)
  }
}

