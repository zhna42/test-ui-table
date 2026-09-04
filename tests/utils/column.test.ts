import { describe, expect, it } from 'vitest'
import { getByPath, resolveValue, toDisplayText } from '@/utils/column'
import type { Column } from '@/types/table'

describe('getByPath', () => {
  it('возвращает undefined при мусорных данных', () => {
    expect(getByPath(null, 'origin.name')).toBeUndefined()
    expect(getByPath(undefined, 'name')).toBeUndefined()
    expect(getByPath({}, 'a.b.c')).toBeUndefined()
  })

  it('возвращает undefined для пустого пути отсутствующего ключа', () => {
    expect(getByPath({ id: 1 }, 'missing')).toBeUndefined()
  })

  it('достаёт вложенное значение по пути', () => {
    expect(getByPath({ origin: { name: 'Earth' } }, 'origin.name')).toBe('Earth')
  })

  it('достаёт плоское значение', () => {
    expect(getByPath({ id: 42 }, 'id')).toBe(42)
  })
})

describe('resolveValue', () => {
  const column: Column = { path: 'origin.name', name: 'origin' }

  it('применяет fn к значению', () => {
    const withFn: Column = {
      ...column,
      fn: (value) => String(value).toUpperCase(),
    }
    expect(resolveValue(withFn, { origin: { name: 'Earth' } })).toBe('EARTH')
  })

  it('возвращает сырое значение без fn', () => {
    expect(resolveValue(column, { origin: { name: 'Earth' } })).toBe('Earth')
  })

  it('возвращает undefined при битых данных', () => {
    expect(resolveValue(column, null)).toBeUndefined()
  })
})

describe('toDisplayText', () => {
  it('возвращает пустую строку для null/undefined/пустого значения', () => {
    expect(toDisplayText(null)).toBe('')
    expect(toDisplayText(undefined)).toBe('')
    expect(toDisplayText('')).toBe('')
  })

  it('сериализует объекты', () => {
    expect(toDisplayText({ name: 'Earth' })).toBe('{"name":"Earth"}')
  })

  it('приводит строки и числа к тексту', () => {
    expect(toDisplayText('Alive')).toBe('Alive')
    expect(toDisplayText(42)).toBe('42')
  })
})
