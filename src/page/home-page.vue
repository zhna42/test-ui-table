<template>
  <main class="home-page">
    <h1 class="home-page__title">Characters</h1>

    <UiTable
      :columns="columns"
      :items="characterStore.characters"
      :page="characterStore.currentPage"
      :page-count="characterStore.totalPages"
      :loading="characterStore.isLoading"
      :search-field="searchField"
      :search-value="searchValue"
      @next-page="goToPage(characterStore.currentPage + 1)"
      @prev-page="goToPage(characterStore.currentPage - 1)"
      @search="onSearch"
    >
      <template #image="{ value, item }">
        <img
          :src="String(value)"
          :alt="`${(item as { name?: string }).name ?? ''}`"
          class="home-page__avatar"
          width="40"
          height="40"
          loading="lazy"
        />
      </template>
    </UiTable>
  </main>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { LocationQueryRaw } from 'vue-router'
import UiTable from '@/components/ui-table/UiTable.vue'
import { useCharacterStore } from '@/stores/useCharacter.store'
import type { CharacterQueryParamsDto } from '@/types/character.dto'
import type { Column } from '@/types/table'

const columns: Column[] = [
  {
    path: 'image',
    name: 'image',
    label: 'Image',
  },
  { path: 'id', name: 'id', label: 'ID' },
  {
    path: 'name',
    name: 'name',
    label: 'Name',
    isSearch: true,
    searchName: 'name',
  },
  {
    path: 'status',
    name: 'status',
    label: 'Status',
    isSearch: true,
    searchName: 'status',
  },
  {
    path: 'species',
    name: 'species',
    label: 'Species',
    isSearch: true,
    searchName: 'species',
  },
  { path: 'origin.name', name: 'origin', label: 'Origin' },
  { path: 'location.name', name: 'location', label: 'Location' },
]

const route = useRoute()
const router = useRouter()
const characterStore = useCharacterStore()

const activeSearchColumn = computed(() =>
  columns.find(
    (column) => column.isSearch && column.searchName && route.query[column.searchName],
  ),
)

const searchField = computed(() => activeSearchColumn.value?.searchName ?? '')
const searchValue = computed(() =>
  activeSearchColumn.value?.searchName
    ? String(route.query[activeSearchColumn.value.searchName] ?? '')
    : '',
)

const applyQuery = async (): Promise<void> => {
  const query = route.query
  const page = Math.max(1, Number(query.page) || 1)
  const active = activeSearchColumn.value
  const filters: CharacterQueryParamsDto = active?.searchName
    ? ({ [active.searchName]: String(query[active.searchName]) } as CharacterQueryParamsDto)
    : {}

  characterStore.filters = filters
  await characterStore.fetchPage(page)
}

watch(() => route.query, applyQuery, { immediate: true })

const updateUrl = (query: LocationQueryRaw): void => {
  router.replace({ query })
}

const goToPage = (page: number): void => {
  updateUrl({ ...route.query, page: String(Math.max(1, page)) })
}

const onSearch = ({ searchName, value }: { searchName: string; value: string }): void => {
  const next: LocationQueryRaw = { ...route.query }

  for (const column of columns) {
    if (column.isSearch && column.searchName) {
      delete next[column.searchName]
    }
  }

  if (value) {
    next[searchName] = value
  }
  delete next.page

  updateUrl(next)
}
</script>

<style scoped lang="scss">
@use '../styles/variables' as *;

.home-page {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100svh;
  padding: 24px;
  max-width: 1100px;
  margin: 0 auto;

  &__title {
    flex: 0 0 auto;
    margin-bottom: 16px;
  }

  &__avatar {
    display: block;
    border-radius: $radius-sm;
    object-fit: cover;
  }
}
</style>
