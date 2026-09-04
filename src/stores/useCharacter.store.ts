import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getCharacters } from '@/api/characters'
import type { CharacterDto, CharacterQueryParamsDto } from '@/types/character.dto'

export const useCharacterStore = defineStore('character', () => {
  const characters = ref<CharacterDto[]>([])
  const filters = ref<CharacterQueryParamsDto>({})
  const currentPage = ref(1)
  const totalPages = ref(0)
  const count = ref(0)
  const isLoading = ref(false)
  const isError = ref(false)

  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const hasPrevPage = computed(() => currentPage.value > 1)

  let activeController: AbortController | null = null
  let requestSeq = 0
  let lastTarget = ''

  const fetchPage = async (page = 1): Promise<void> => {
    const target = JSON.stringify({ page, ...filters.value })
    if (target === lastTarget) {
      return
    }

    activeController?.abort()
    const controller = new AbortController()
    activeController = controller
    const seq = ++requestSeq

    isLoading.value = true
    isError.value = false

    try {
      const response = await getCharacters(
        { ...filters.value, page },
        { signal: controller.signal },
      )

      if (seq !== requestSeq) {
        return
      }

      lastTarget = target
      characters.value = response.results
      count.value = response.info.count
      totalPages.value = response.info.pages
      currentPage.value = page
    } catch (error) {
      if (controller.signal.aborted || seq !== requestSeq) {
        return
      }
      isError.value = true
      throw error
    } finally {
      if (seq === requestSeq) {
        isLoading.value = false
      }
    }
  }

  const search = async (params: CharacterQueryParamsDto): Promise<void> => {
    lastTarget = ''
    filters.value = { ...params }
    characters.value = []
    currentPage.value = 1
    totalPages.value = 0
    count.value = 0

    await fetchPage(1)
  }

  const reset = (): void => {
    lastTarget = ''
    filters.value = {}
    characters.value = []
    currentPage.value = 1
    totalPages.value = 0
    count.value = 0
  }

  const fetchNextPage = async (): Promise<void> => {
    if (hasNextPage.value) {
      await fetchPage(currentPage.value + 1)
    }
  }

  const fetchPrevPage = async (): Promise<void> => {
    if (hasPrevPage.value) {
      await fetchPage(currentPage.value - 1)
    }
  }

  return {
    characters,
    filters,
    currentPage,
    totalPages,
    count,
    isLoading,
    isError,
    hasNextPage,
    hasPrevPage,
    fetchPage,
    fetchNextPage,
    fetchPrevPage,
    search,
    reset,
  }
})
