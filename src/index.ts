import { argv } from "process";
import { crawlSiteAsync } from "./crawl"


async function main() {
  if (argv.length < 3) {
    console.error(`function main() - not enough arguments:\n${argv.length}`)
    process.exit(1)
  }

  if (argv.length > 3) {
    console.error(`function main() - too many arguments:\n${argv.length}`)
    process.exit(1)
  }

  const BASE_URL = argv[2]
  console.log(`Crawler starting work on ${BASE_URL}`)
  const pages = await crawlSiteAsync(BASE_URL, 3)
  console.log(pages)
}

await main()

