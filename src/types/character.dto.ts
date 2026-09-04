export type CharacterStatusDto = 'Alive' | 'Dead' | 'unknown'

export type CharacterGenderDto = 'Female' | 'Male' | 'Genderless' | 'unknown'

export interface CharacterLocationDto {
  name: string
  url: string
}

export interface CharacterDto {
  id: number
  name: string
  status: CharacterStatusDto
  species: string
  type: string
  gender: CharacterGenderDto
  origin: CharacterLocationDto
  location: CharacterLocationDto
  image: string
  episode: string[]
  url: string
  created: string
}

export interface CharactersInfoDto {
  count: number
  pages: number
  next: string | null
  prev: string | null
}

export interface CharactersResponseDto {
  info: CharactersInfoDto
  results: CharacterDto[]
}

export interface CharacterQueryParamsDto {
  page?: number
  name?: string
  status?: CharacterStatusDto
  species?: string
  type?: string
  gender?: CharacterGenderDto
}
