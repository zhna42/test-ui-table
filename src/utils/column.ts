import type { Column } from '@/types/table'

/** Достаёт значение по точечному пути из объекта */
export const getByPath = (source: unknown, path: string): unknown =>
  path.split('.').reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined) {
      return undefined
    }
    return (acc as Record<string, unknown>)[key]
  }, source)

/** Значение колонки для ячейки (path + fn) */
export const resolveValue = (column: Column, item: unknown): unknown => {
  const raw = getByPath(item, column.path)
  return column.fn ? column.fn(raw) : raw
}

/** Текстовое представление значения для fallback-рендера */
export const toDisplayText = (value: unknown): string => {
  if (value === null || value === undefined) {
    return ''
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}
