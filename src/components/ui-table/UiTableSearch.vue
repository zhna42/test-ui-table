<template>
  <form role="search" class="ui-table-search" @submit.prevent="handleSubmit">
    <label class="ui-table-search__label">
      <span class="ui-table-search__sr-only">Поле поиска</span>
      <select
        v-model="activeField"
        class="ui-table-search__field"
        @change="handleFieldChange"
      >
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>
    <label class="ui-table-search__label ui-table-search__label--grow">
      <span class="ui-table-search__sr-only">Текст поиска</span>
      <input
        v-model="text"
        type="search"
        class="ui-table-search__input"
        placeholder="Поиск..."
        @input="handleChange(text)"
      />
    </label>
  </form>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import type { Column } from '@/types/table'

const props = withDefaults(
  defineProps<{
    columns: Column[]
    field: string
    value: string
  }>(),
  { value: '' },
)

const emit = defineEmits<{
  (e: 'update:value', value: string): void
  (e: 'change', payload: { searchName: string; value: string }): void
}>()

const text = ref(props.value)
const activeField = ref(props.field)

let debounceTimer: ReturnType<typeof setTimeout> | undefined

const options = props.columns
  .filter((column) => column.isSearch && column.searchName)
  .map((column) => ({
    value: column.searchName as string,
    label: column.label ?? column.name,
  }))

const clearTimer = (): void => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = undefined
  }
}

const handleChange = (value: string): void => {
  emit('update:value', value)
  clearTimer()
  debounceTimer = setTimeout(() => {
    emit('change', { searchName: activeField.value, value })
  }, 300)
}

const handleFieldChange = (): void => {
  // Смена поля сбрасывает текст поиска
  text.value = ''
  emit('update:value', '')
  emit('change', { searchName: activeField.value, value: '' })
}

const handleSubmit = (): void => {
  clearTimer()
  emit('change', { searchName: activeField.value, value: text.value })
}

watch(
  () => props.field,
  (field) => {
    activeField.value = field
  },
)

onBeforeUnmount(clearTimer)
</script>

<style scoped lang="scss">
@use '../../styles/variables' as *;

.ui-table-search {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;

  &__label {
    display: flex;
    align-items: center;

    &--grow {
      flex: 1;
    }
  }

  &__sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }

  &__field {
    padding: 6px 8px;
    border: 1px solid $color-border;
    border-radius: 6px;
  }

  &__input {
    flex: 1;
    min-width: 0;
    padding: 6px 10px;
    border: 1px solid $color-border;
    border-radius: 6px;
  }
}
</style>
