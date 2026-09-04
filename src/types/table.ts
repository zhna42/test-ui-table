export interface Column {
  /** Путь до значения в item через точку: 'origin.name' */
  path: string
  /** Имя скоп-слота для ячейки */
  name: string
  /** Текст заголовка колонки в <th> */
  label?: string
  /** Показывать колонку (default true) */
  visible?: boolean
  /** Поле участвует в поиске (попадает в выпадашку) */
  isSearch?: boolean
  /** Имя GET-параметра поиска для этого поля */
  searchName?: string
  /** Трансформер значения для показа в ячейке */
  fn?: (value: unknown) => unknown
}
