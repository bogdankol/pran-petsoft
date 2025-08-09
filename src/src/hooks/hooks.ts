import { useContext } from 'react'
import { PetContext } from '@/contexts/pet-context-provider'
import { SearchContext } from '@/contexts/search-context-provider'

export function usePetContext() {
  const context = useContext(PetContext)

  if(!context) throw new Error('PetContext is not initialized')

  return context
}

export function useSearchContext() {
  const context = useContext(SearchContext)

  if(!context) throw new Error('SearchContext is not initialized')

  return context
}