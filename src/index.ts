import { argv } from "process";
import { crawlSiteAsync } from "./concurency";
import { writeCSVReport } from "./report";


async function main() {
  if (argv.length < 3) {
    console.error(`Not enough arguments, You provided: ${argv.length}, please provide 3.`)
    process.exit(1)
  }

  const BASE_URL = argv[2]
  const MAX_CONCURENCY = Number(argv[3])
  const MAX_PAGES = Number(argv[4])

  console.log(`Crawler starting work on ${BASE_URL}`)
  const pages = await crawlSiteAsync(BASE_URL, MAX_CONCURENCY, MAX_PAGES)
  console.log("Finished crawling.");
  const firstPage = Object.values(pages)[0];
  if (firstPage) {
    console.log(`First page record: ${firstPage["url"]} - ${firstPage["h1"]}`);
  }

  writeCSVReport(pages, "report.csv")
}

await main()

