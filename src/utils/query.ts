/**
 * Склеивает объект параметров в строку GET-запроса.
 * Пустые/undefined/null значения пропускаются, массивы дублируют ключ.
 * Возвращает строку с ведущим "?" или пустую строку, если параметров нет.
 */
export const buildQueryString = <T extends object>(params: T): string => {
  const search = new URLSearchParams()

  const append = (key: string, value: unknown): void => {
    if (value === undefined || value === null || value === '') {
      return
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        append(key, item)
      }
      return
    }
    search.append(key, String(value))
  }

  for (const key of Object.keys(params) as Array<keyof T>) {
    append(String(key), params[key])
  }

  const query = search.toString()
  return query ? `?${query}` : ''
}
