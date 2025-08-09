'use client'
import { createContext, ReactNode, useState } from 'react'

type TContext = {
  searchQuery: string
  updateSearchInput: (v: string) => void
}

export const SearchContext = createContext<TContext | null>(null)

export default function SearchContextProvider({ children }: { children: ReactNode[] | ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('')

  const updateSearchInput = (v: string) => setSearchQuery(v)

  return <SearchContext.Provider
    value={{
      searchQuery,
      updateSearchInput
    }}
  >{children}</SearchContext.Provider>
}