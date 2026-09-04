import type { AxiosRequestConfig } from 'axios'
import { http } from './http'
import { buildQueryString } from '@/utils/query'
import type {
  CharacterDto,
  CharacterQueryParamsDto,
  CharactersResponseDto,
} from '@/types/character.dto'

export const getCharacters = (
  params: CharacterQueryParamsDto = {},
  options?: AxiosRequestConfig,
): Promise<CharactersResponseDto> => {
  const query = buildQueryString(params)
  return http.get(`/character/${query}`, options).then((response) => response.data)
}

export const getCharacter = (id: number): Promise<CharacterDto> =>
  http.get(`/character/${id}`).then((response) => response.data)
