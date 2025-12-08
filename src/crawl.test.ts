import { expect, test } from 'vitest'
import { normalizeURL } from './crawl'


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

