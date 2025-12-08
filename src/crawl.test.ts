import { expect, test } from 'vitest'
import { getFirstH1FromHtml, getFirstParagraphFromHTML, normalizeURL } from './crawl'


test('forward slash still means same url', () => {
  expect(normalizeURL('https://vitest.dev/guide/#writing-tests/')).toEqual(normalizeURL('https://vitest.dev/guide/#writing-tests'))
})

test('different protocol (https vs http) still means same url', () => {
  expect(normalizeURL('https://vitest.dev/guide/#writing-tests')).toEqual(normalizeURL('http://vitest.dev/guide/#writing-tests'))
})

test('different protocol (file vs https) still means same url', () => {
  expect(normalizeURL('https://vitest.dev/guide/')).toEqual(normalizeURL('file://vitest.dev/guide/'))
})

test('different protocol (ftp vs https) still means same url', () => {
  expect(normalizeURL('https://vitest.dev/guide/')).toEqual(normalizeURL('ftp://vitest.dev/guide/'))
})

test('has hash still means same url', () => {
  expect(normalizeURL('https://vitest.dev/guide/#writing-tests')).toEqual(normalizeURL('https://vitest.dev/guide/'))
})

test('finds existing first h1', () => {
  const htmlStr = `<html>
  <body>
    <h2>Welcome to the Jungle</h1>
    <h1>Welcome to Boot.dev</h1>
    <h1>Welcome to Faraoh land</h1>
    <main>
      <p>Learn to code by building real projects.</p>
      <p>This is the second paragraph.</p>
    </main>
  </body>
</html>
  `
  expect(getFirstH1FromHtml(htmlStr)).toEqual('Welcome to Boot.dev')
})

test('finds no h1 element', () => {
  const htmlStr = `<html>
  <body>
    <main>
      <p>Learn to code by building real projects.</p>
      <p>This is the second paragraph.</p>
    </main>
  </body>
</html>
  `
  expect(getFirstH1FromHtml(htmlStr)).toEqual('')
})

test("basic h1 find", () => {
  const inputBody = `<html><body><h1>Test Title</h1></body></html>`
  const actual = getFirstH1FromHtml(inputBody)
  const expected = "Test Title"
  expect(actual).toEqual(expected)
})

test("getFirstParagraphFromHTML main priority", () => {
  const inputBody = `
    <html><body>
      <p>Outside paragraph.</p>
      <main>
        <p>Main paragraph.</p>
      </main>
    </body></html>
  `;
  const actual = getFirstParagraphFromHTML(inputBody)
  const expected = "Main paragraph."
  expect(actual).toEqual(expected)
})

test("getFirstParagraphFromHTML outside main priority", () => {
  const inputBody = `
    <html><body>
      <p>Outside paragraph.</p>
        <p>Main paragraph.</p>
    </body></html>
  `;
  const actual = getFirstParagraphFromHTML(inputBody)
  const expected = "Outside paragraph."
  expect(actual).toEqual(expected)
})

test("getFirstParagraphFromHTML nested deeper within main", () => {
  const inputBody = `
<!DOCTYPE html>
<html>
  <body>
    <main>
      <div class="wrapper">
        <section>
          <p>Deeply nested first paragraph.</p>
        </section>
      </div>
      <p>Another paragraph after nested one.</p>
    </main>
  </body>
</html>
`

  const actual = getFirstParagraphFromHTML(inputBody)
  const expected = "Deeply nested first paragraph."
  expect(actual).toEqual(expected)
})

test("getFirstParagraphFromHTML no paragraph should be empty string", () => {
  const inputBody = `
<!DOCTYPE html>
<html>
  <body>
    <main>
      <div class="wrapper">
        <section>
        </section>
      </div>
    </main>
  </body>
</html>
`

  const actual = getFirstParagraphFromHTML(inputBody)
  const expected = ""
  expect(actual).toEqual(expected)
})

