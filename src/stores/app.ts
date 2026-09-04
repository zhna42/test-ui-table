import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const count = ref(0)

  const increment = (): void => {
    count.value++
  }

  return { count, increment }
})
