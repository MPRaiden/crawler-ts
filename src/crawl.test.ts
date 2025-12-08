import { expect, test } from 'vitest'
import { normalizeURL } from './crawl'


test('forward slash still means same url', () => {
  expect(normalizeURL('https://vitest.dev/guide/#writing-tests/')).toBe('https://vitest.dev/guide/#writing-tests')
})

test('http or https still means same url', () => {
  expect(normalizeURL('https://vitest.dev/guide/#writing-tests')).toBe('http://vitest.dev/guide/#writing-tests')
})

test('no protocol still means same url', () => {
  expect(normalizeURL('https://vitest.dev/guide/#writing-tests')).toBe('vitest.dev/guide/#writing-tests')
})

