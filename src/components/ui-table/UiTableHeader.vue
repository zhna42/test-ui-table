<template>
  <thead class="ui-table__head">
    <tr>
      <th
        v-for="column in columns.filter((c) => c.visible !== false)"
        :key="column.name"
        scope="col"
      >
        {{ column.label ?? column.name }}
      </th>
    </tr>
  </thead>
</template>

<script setup lang="ts">
import type { Column } from '@/types/table'

defineProps<{
  columns: Column[]
}>()
</script>

<style scoped lang="scss">
@use '../../styles/variables' as *;

.ui-table__head {
  th {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 10px 12px;
    text-align: left;
    font-weight: 600;
    color: $color-text-muted;
    background-color: $color-bg-alt;
    border-bottom: 1px solid $color-border;
  }
}
</style>
