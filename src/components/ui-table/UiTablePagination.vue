<template>
  <nav class="ui-table-pagination" aria-label="Пагинация">
    <button
      class="ui-table-pagination__button"
      type="button"
      :disabled="!canPrev"
      @click="emit('prev')"
    >
      &larr; Назад
    </button>
    <span class="ui-table-pagination__info">
      Страница {{ page }} из {{ pageCount }}
    </span>
    <button
      class="ui-table-pagination__button"
      type="button"
      :disabled="!canNext"
      @click="emit('next')"
    >
      Вперёд &rarr;
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    page: number
    pageCount: number
  }>(),
  { page: 1, pageCount: 0 },
)

const emit = defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
}>()

const canPrev = computed(() => props.page > 1)
const canNext = computed(() => props.pageCount > 0 && props.page < props.pageCount)
</script>

<style scoped lang="scss">
@use '../../styles/variables' as *;

.ui-table-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 12px;

  &__button {
    padding: 6px 12px;
    border: 1px solid $color-border;
    border-radius: 6px;
    background-color: $color-bg;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__info {
    color: $color-text-muted;
  }
}
</style>
