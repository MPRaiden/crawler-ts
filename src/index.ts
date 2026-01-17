import { argv } from "process";
import { crawlSiteAsync } from "./concurency";


async function main() {
  if (argv.length < 3) {
    console.error(`Not enough arguments, You provided: ${argv.length}, please provide 3.`)
    process.exit(1)
  }

  const BASE_URL = argv[2]
  const MAX_CONCURENCY = Number(argv[3])
  console.log(`Crawler starting work on ${BASE_URL}`)
  const pages = await crawlSiteAsync(BASE_URL, MAX_CONCURENCY)
  console.log(pages)
}

await main()

