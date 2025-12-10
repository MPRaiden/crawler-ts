import { expect, test } from 'vitest'
import { extractPageData, getFirstH1FromHtml, getFirstParagraphFromHTML, getIMGsFromHTML, getURLsFromHTML, normalizeURL } from './crawl'


// test('forward slash still means same url', () => {
//   expect(normalizeURL('https://vitest.dev/guide/#writing-tests/')).toEqual(normalizeURL('https://vitest.dev/guide/#writing-tests'))
// })

// test('different protocol (https vs http) still means same url', () => {
//   expect(normalizeURL('https://vitest.dev/guide/#writing-tests')).toEqual(normalizeURL('http://vitest.dev/guide/#writing-tests'))
// })

// test('different protocol (file vs https) still means same url', () => {
//   expect(normalizeURL('https://vitest.dev/guide/')).toEqual(normalizeURL('file://vitest.dev/guide/'))
// })

// test('different protocol (ftp vs https) still means same url', () => {
//   expect(normalizeURL('https://vitest.dev/guide/')).toEqual(normalizeURL('ftp://vitest.dev/guide/'))
// })

// test('has hash still means same url', () => {
//   expect(normalizeURL('https://vitest.dev/guide/#writing-tests')).toEqual(normalizeURL('https://vitest.dev/guide/'))
// })

// test('finds existing first h1', () => {
//   const htmlStr = `<html>
//   <body>
//     <h2>Welcome to the Jungle</h1>
//     <h1>Welcome to Boot.dev</h1>
//     <h1>Welcome to Faraoh land</h1>
//     <main>
//       <p>Learn to code by building real projects.</p>
//       <p>This is the second paragraph.</p>
//     </main>
//   </body>
// </html>
//   `
//   expect(getFirstH1FromHtml(htmlStr)).toEqual('Welcome to Boot.dev')
// })

// test('finds no h1 element', () => {
//   const htmlStr = `<html>
//   <body>
//     <main>
//       <p>Learn to code by building real projects.</p>
//       <p>This is the second paragraph.</p>
//     </main>
//   </body>
// </html>
//   `
//   expect(getFirstH1FromHtml(htmlStr)).toEqual('')
// })

// test("basic h1 find", () => {
//   const inputBody = `<html><body><h1>Test Title</h1></body></html>`
//   const actual = getFirstH1FromHtml(inputBody)
//   const expected = "Test Title"
//   expect(actual).toEqual(expected)
// })

// test("getFirstParagraphFromHTML main priority", () => {
//   const inputBody = `
//     <html><body>
//       <p>Outside paragraph.</p>
//       <main>
//         <p>Main paragraph.</p>
//       </main>
//     </body></html>
//   `;
//   const actual = getFirstParagraphFromHTML(inputBody)
//   const expected = "Main paragraph."
//   expect(actual).toEqual(expected)
// })

// test("getFirstParagraphFromHTML outside main priority", () => {
//   const inputBody = `
//     <html><body>
//       <p>Outside paragraph.</p>
//         <p>Main paragraph.</p>
//     </body></html>
//   `;
//   const actual = getFirstParagraphFromHTML(inputBody)
//   const expected = "Outside paragraph."
//   expect(actual).toEqual(expected)
// })

// test("getFirstParagraphFromHTML nested deeper within main", () => {
//   const inputBody = `
// <!DOCTYPE html>
// <html>
//   <body>
//     <main>
//       <div class="wrapper">
//         <section>
//           <p>Deeply nested first paragraph.</p>
//         </section>
//       </div>
//       <p>Another paragraph after nested one.</p>
//     </main>
//   </body>
// </html>
// `

//   const actual = getFirstParagraphFromHTML(inputBody)
//   const expected = "Deeply nested first paragraph."
//   expect(actual).toEqual(expected)
// })

// test("getFirstParagraphFromHTML no paragraph should be empty string", () => {
//   const inputBody = `
// <!DOCTYPE html>
// <html>
//   <body>
//     <main>
//       <div class="wrapper">
//         <section>
//         </section>
//       </div>
//     </main>
//   </body>
// </html>
// `

//   const actual = getFirstParagraphFromHTML(inputBody)
//   const expected = ""
//   expect(actual).toEqual(expected)
// })

// test("getURLsFromHTML absolute", () => {
//   const inputURL = "https://blog.boot.dev"
//   const inputBody = `<html><body><a href="https://blog.boot.dev"><span>Boot.dev</span></a></body></html>`

//   const actual = getURLsFromHTML(inputBody, inputURL)
//   const expected = ["https://blog.boot.dev/"]

//   expect(actual).toEqual(expected)
// })

// test("getURLsFromHTML relative", () => {
//   const inputURL = "https://blog.boot.dev"
//   const inputBody = `<html><body><a href="/path/one"><span>Boot.dev</span></a></body></html>`
//   const actual = getURLsFromHTML(inputBody, inputURL)
//   const expected = ["https://blog.boot.dev/path/one"]
//   expect(actual).toEqual(expected)
// })

// test("getURLsFromHTML both absolute and relative", () => {
//   const inputURL = "https://blog.boot.dev";
//   const inputBody =
//     `<html><body>` +
//     `<a href="/path/one"><span>Boot.dev</span></a>` +
//     `<a href="https://other.com/path/one"><span>Boot.dev</span></a>` +
//     `</body></html>`
//   const actual = getURLsFromHTML(inputBody, inputURL)
//   const expected = [
//     "https://blog.boot.dev/path/one",
//     "https://other.com/path/one",
//   ]
//   expect(actual).toEqual(expected)
// })

// test("getIMGsFromHTML absolute", () => {
//   const inputURL = "https://blog.boot.dev"
//   const inputBody = `<html><body><img src="https://blog.boot.dev/logo.png" alt="Logo"></body></html>`
//   const actual = getIMGsFromHTML(inputBody, inputURL)
//   const expected = ["https://blog.boot.dev/logo.png"]
//   expect(actual).toEqual(expected)
// })

// test("getImagesFromHTML relative", () => {
//   const inputURL = "https://blog.boot.dev"
//   const inputBody = `<html><body><img src="/logo.png" alt="Logo"></body></html>`
//   const actual = getIMGsFromHTML(inputBody, inputURL)
//   const expected = ["https://blog.boot.dev/logo.png"]
//   expect(actual).toEqual(expected)
// })

// test("getImagesFromHTML multiple", () => {
//   const inputURL = "https://blog.boot.dev";
//   const inputBody =
//     `<html><body>` +
//     `<img src="/logo.png" alt="Logo">` +
//     `<img src="https://cdn.boot.dev/banner.jpg">` +
//     `</body></html>`
//   const actual = getIMGsFromHTML(inputBody, inputURL)
//   const expected = [
//     "https://blog.boot.dev/logo.png",
//     "https://cdn.boot.dev/banner.jpg",
//   ]
//   expect(actual).toEqual(expected)
// })

test("extract_page_data basic", () => {
  const inputURL = "https://blog.boot.dev";
  const inputBody = `
    <html><body>
      <h1>Test Title</h1>
      <p>This is the first paragraph.</p>
      <a href="/link1">Link 1</a>
      <img src="/image1.jpg" alt="Image 1">
    </body></html>
  `;

  const actual = extractPageData(inputBody, inputURL);
  const expected = {
    url: "https://blog.boot.dev",
    h1: "Test Title",
    first_paragraph: "This is the first paragraph.",
    outgoing_links: ["https://blog.boot.dev/link1"],
    image_urls: ["https://blog.boot.dev/image1.jpg"],
  };

  expect(actual).toEqual(expected);
});

test("extract_page_data main section priority", () => {
  const inputURL = "https://blog.boot.dev";
  const inputBody = `
    <html><body>
      <nav><p>Navigation paragraph</p></nav>
      <main>
        <h1>Main Title</h1>
        <p>Main paragraph content.</p>
      </main>
    </body></html>
  `;

  const actual = extractPageData(inputBody, inputURL);
  expect(actual.h1).toEqual("Main Title");
  expect(actual.first_paragraph).toEqual("Main paragraph content.");
});

test("extract_page_data missing elements", () => {
  const inputURL = "https://blog.boot.dev";
  const inputBody = `<html><body><div>No h1, p, links, or images</div></body></html>`;

  const actual = extractPageData(inputBody, inputURL);
  const expected = {
    url: "https://blog.boot.dev",
    h1: "",
    first_paragraph: "",
    outgoing_links: [],
    image_urls: [],
  };

  expect(actual).toEqual(expected)
})
