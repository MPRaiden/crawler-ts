import * as fs from "node:fs"
import * as path from "node:path"
import { ExtractedPageData } from "./types"

export function writeCSVReport(
  pageData: Record<string, ExtractedPageData>,
  filename = "report.csv",
): void {

  const filePath = path.resolve(process.cwd(), filename)

  const headers = ["page_url", "h1", "first_paragraph", "outgoing_link_urls", "image_urls"]
  const rows: string[] = [headers.join(",")]

  let skippedRows = 0
  for (const [key, value] of Object.entries(pageData)) {
    if (!key || typeof value !== "object") {
      skippedRows++
      continue
    }

    const url = typeof value.url === "string" ? value.url : ""
    const h1 = typeof value.h1 === "string" ? value.h1 : ""
    const firstParagraph = typeof value.first_paragraph === "string" ? value.first_paragraph : ""
    const outgoingLinks = Array.isArray(value.outgoing_links) ? value.outgoing_links : []
    const imgs = Array.isArray(value.image_urls) ? value.image_urls : []

    const allValues = [url, h1, firstParagraph, outgoingLinks.join(";"), imgs.join(";")].map(csvEscape)
    rows.push(allValues.join(","))
  }

  fs.writeFileSync(filePath, rows.join("\n"), { encoding: "utf-8" })
  console.log(`Report written to ${filePath}, skipped ${skippedRows} rows for missing/faulty values`)
}

function csvEscape(field: string) {
  const str = field ?? "";
  const needsQuoting = /[",\n]/.test(str);
  const escaped = str.replace(/"/g, '""');
  return needsQuoting ? `"${escaped}"` : escaped;
}
