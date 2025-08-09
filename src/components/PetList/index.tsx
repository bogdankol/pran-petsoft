'use client'
import { usePetContext, useSearchContext } from '@/hooks/hooks'
import { TPet } from '@/lib/types'
// import { Pet as TPet } from '@prisma/client'
import Image from 'next/image'
import { cn } from '@/lib/client-utils'
import { useMemo } from 'react'

export default function PetList() {
  const { pets, updateSelectedPetId, selectedPetId } = usePetContext()
  const { searchQuery } = useSearchContext()

  const filteredPets = useMemo(
    () =>
      pets.filter((pet) =>
        pet.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [pets, searchQuery]
  )

  return (
    <ul className="bg-white border-b border-black/[0.08]">
      {filteredPets.map((pet: TPet) => (
        <li key={pet.id}>
          <button
            onClick={() => updateSelectedPetId(pet.id)}
            className={cn(
              'flex h-[70px] w-full cursor-pointer items-center px-5 text-base gap-3 hover:bg-color1 focus:bg-color1 transition',
              { 'bg-color1': selectedPetId === pet.id }
            )}
          >
            <Image
              src={pet.imageUrl}
              alt={pet.name}
              title={pet.name}
              width={45}
              height={45}
              className="w-[45px] h-[45px] rounded-full object-cover"
            />

            <p className="font-semibold">{pet.name}</p>
          </button>
        </li>
      ))}
    </ul>
  )
}
