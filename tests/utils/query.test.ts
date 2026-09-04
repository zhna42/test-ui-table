import { describe, expect, it } from 'vitest'
import { buildQueryString } from '@/utils/query'

describe('buildQueryString', () => {
  it('возвращает пустую строку при мусорных/битых параметрах', () => {
    expect(buildQueryString({ page: undefined, name: '', status: null })).toBe('')
    expect(buildQueryString({ name: undefined, filter: [] })).toBe('')
  })

  it('возвращает пустую строку при пустом объекте', () => {
    expect(buildQueryString({})).toBe('')
  })

  it('собирает строку из корректных параметров (страница)', () => {
    expect(buildQueryString({ page: 4 })).toBe('?page=4')
  })

  it('собирает строку из нескольких корректных параметров', () => {
    expect(buildQueryString({ name: 'rick', status: 'Alive', page: 1 })).toBe(
      '?name=rick&status=Alive&page=1',
    )
  })
})
