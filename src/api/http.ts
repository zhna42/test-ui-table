import axios from 'axios'
import type { AxiosInstance, CreateAxiosDefaults } from 'axios'

const config: CreateAxiosDefaults = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
}

export const http: AxiosInstance = axios.create(config)

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

http.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: глобальная обработка ошибок (401 → logout/redirect, показ сообщений и т.п.)
    return Promise.reject(error)
  },
)

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    return data?.message ?? error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Unknown error'
}
