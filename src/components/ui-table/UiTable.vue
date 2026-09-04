<template>
  <div class="ui-table">
    <UiTableSearch
      v-if="searchableColumns.length"
      :columns="searchableColumns"
      :field="searchField || (searchableColumns[0].searchName as string)"
      :value="searchValue"
      @change="emit('search', $event)"
    />

    <div class="ui-table__scroll">
      <table class="ui-table__table">
        <UiTableHeader :columns="visibleColumns" />
        <tbody>
          <UiTableItem
            v-for="(item, index) in items"
            :key="keyOf(item, index)"
            :columns="visibleColumns"
            :item="item"
          >
            <template
              v-for="column in visibleColumns"
              :key="column.name"
              #[column.name]="{ item: rowItem, value, column: col }"
            >
              <slot :name="column.name" :item="rowItem" :value="value" :column="col">
                {{ toDisplayText(value) }}
              </slot>
            </template>
          </UiTableItem>
          <tr v-if="empty" class="ui-table__empty-row" aria-live="polite">
            <td :colspan="visibleColumns.length" class="ui-table__empty-cell">
              {{ loading ? 'Загрузка...' : 'Нет данных' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <UiTablePagination
      :page="page"
      :page-count="pageCount"
      @prev="emit('prev-page')"
      @next="emit('next-page')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UiTableHeader from './UiTableHeader.vue'
import UiTableItem from './UiTableItem.vue'
import UiTablePagination from './UiTablePagination.vue'
import UiTableSearch from './UiTableSearch.vue'
import { toDisplayText, getByPath } from '@/utils/column'
import type { Column } from '@/types/table'

const props = withDefaults(
  defineProps<{
    columns: Column[]
    items: unknown[]
    page?: number
    pageCount?: number
    loading?: boolean
    searchField?: string
    searchValue?: string
    /** Путь до уникального ключа строки (например 'id'). Иначе используется индекс. */
    rowKeyPath?: string
  }>(),
  {
    page: 1,
    pageCount: 0,
    loading: false,
    searchField: '',
    searchValue: '',
    rowKeyPath: '',
  },
)

const emit = defineEmits<{
  (e: 'next-page'): void
  (e: 'prev-page'): void
  (e: 'search', payload: { searchName: string; value: string }): void
}>()

const searchableColumns = computed(() => props.columns.filter((column) => column.isSearch))
const visibleColumns = computed(() => props.columns.filter((column) => column.visible !== false))
const empty = computed(() => !props.items.length)

const keyOf = (item: unknown, index: number): string | number => {
  if (!props.rowKeyPath) {
    return index
  }
  const value = getByPath(item, props.rowKeyPath)
  return value === undefined || value === null ? index : String(value)
}
</script>

<style scoped lang="scss">
@use '../../styles/variables' as *;

.ui-table {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
}

.ui-table__scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
}

.ui-table__table {
  width: 100%;
  border-collapse: collapse;
}

.ui-table__empty-cell {
  padding: 16px;
  text-align: center;
  color: $color-text-muted;
}
</style>
