<template>
  <tr class="ui-table__row">
    <td
      v-for="column in columns.filter((c) => c.visible !== false)"
      :key="column.name"
      class="ui-table__cell"
    >
      <slot :name="column.name" :item="item" :value="resolveValue(column, item)" :column="column" />
    </td>
  </tr>
</template>

<script setup lang="ts">
import { resolveValue } from '@/utils/column'
import type { Column } from '@/types/table'

defineProps<{
  columns: Column[]
  item: unknown
}>()
</script>

<style scoped lang="scss">
@use '../../styles/variables' as *;

.ui-table__row {
  &:nth-child(even) {
    background-color: $color-bg-alt;
  }

  &:hover {
    background-color: #f0f4ff;
  }
}

.ui-table__cell {
  padding: 8px 12px;
  border-bottom: 1px solid $color-border;
}
</style>
