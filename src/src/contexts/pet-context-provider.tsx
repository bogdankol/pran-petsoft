'use client'
import { TPet } from '@/lib/types'
// import { Pet as TPet } from '@prisma/client'
import { addPet, checkoutPet, editPet } from '@/serverActions/actions'
// import { addPet } from '@/serverActions/actions'
import {
  createContext,
  ReactNode,
  useOptimistic,
  useState,
  useTransition,
} from 'react'
import { toast } from 'sonner'

type TPetContext = {
  pets: TPet[]
  selectedPetId:  TPet['id'] | null
  updateSelectedPetId: (id:  TPet['id']) => void
  selectedPetData: TPet | null
  numberOfPets: number
  handleCheckoutPet: (id: string) => Promise<void>
  handleAddPet: (newPetData: TPet) => Promise<void> // removed because of server action 'addPet'
  handleEditPet: (id: string, newPetData: TPet) => Promise<void>
}

type TOptimistic = { 
  action: 'add' | 'edit' | 'delete'
  newPetData?: TPet
  id?: string
}

export const PetContext = createContext<TPetContext | null>(null)

export default function PetContextProvider({
  children,
  data,
}: {
  children: ReactNode[] | ReactNode
  data: TPet[]
}) {
  // const [pets, setPets] = useState(data)
  const [_, startTransition] = useTransition()

  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (
      prev: TPet[],
      {
        action,
        newPetData,
        id,
      }: TOptimistic
    ) => {
      switch (action) {
        case 'add':
          return newPetData ? [...prev, newPetData] : prev
        case 'edit':
          return id && newPetData ? prev.map((pet) => {
            if (id === pet.id)
              return {
                ...pet,
                ...newPetData,
              }
            return pet
          }) : prev
        case 'delete':
          return id ? prev.filter((pet) => pet.id !== id) : prev
        default:
          return prev
      }
    }
  )

  const selectedPetData =
    optimisticPets.find((el) => el.id === selectedPetId) ?? null
  const numberOfPets = optimisticPets.length

  const updateSelectedPetId = (id: string) => setSelectedPetId(id)

  const handleCheckoutPet = async (id: string) => {
    startTransition(() => {
      setOptimisticPets({ action: 'delete', id })
    })

    const error = await checkoutPet(id)

    if (error) {
      toast.error(error.message)
      return
    }

    setSelectedPetId(null)
    // setPets(prev => prev.filter(pet => pet.id !== id))
  }

  const handleAddPet = async (newPetData: TPet) => {
    // await addPet(newPet)
    // setPets(prev => [...prev, newPet])

    setOptimisticPets({ action: 'add', newPetData })

    const error = await addPet(newPetData)

    if (error) {
      toast.error(error.message)
      return
    }
  }

  const handleEditPet = async (petId:  TPet['id'], newPetData: TPet) => {
    // setPets(prev => prev.map(pet => {
    //   if(id === pet.id) return {
    //     ...pet,
    //     ...newPetData
    //   }
    //   return pet
    // }))

    setOptimisticPets({ action: 'edit', id: petId, newPetData })

    const error = await editPet(petId, newPetData)

    if (error) {
      toast.error(error.message)
      return
    }
  }

  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
        selectedPetId,
        updateSelectedPetId,
        selectedPetData,
        numberOfPets,
        handleCheckoutPet,
        handleAddPet,
        handleEditPet,
      }}
    >
      {children}
    </PetContext.Provider>
  )
}
