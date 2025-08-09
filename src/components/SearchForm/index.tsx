'use client'
import { useSearchContext } from '@/hooks/hooks'

export default function SearchForm() {

  const {
    searchQuery,
    updateSearchInput
  } = useSearchContext()
  return (
    <form className="w-full h-full">
      <input 
        className="w-full h-full bg-white/20 rounded-md outline-none transition focus:bg-white/50 hover:bg-white/30 placeholder:text-white/50" 
        placeholder='Search pets'
        type='search'
        value={searchQuery}
        onChange={e => updateSearchInput(e.target.value)}
      />
    </form>
  )
}
