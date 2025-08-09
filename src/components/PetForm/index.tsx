'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { usePetContext } from '@/hooks/hooks'
import { TPet } from '@/lib/types'
// import { Pet as TPet } from '@prisma/client'
import PetFormBtn from 'components/PetFormBtn'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { defaultImageUrl } from '@/lib/constants'
import { PetFormSchema, TPetForm } from '@/lib/validations'


export default function PetForm({
  actionType,
  onFormSubmission,
}: {
  actionType: 'add' | 'edit'
  onFormSubmission: () => void
}) {
  const { handleAddPet, selectedPetData, handleEditPet } = usePetContext()

  const {
    register,
    formState: {
      errors
    },
    trigger,
    getValues
  } = useForm<TPetForm>({
    // @ts-expect-error some error
    resolver: zodResolver(PetFormSchema),
    defaultValues: actionType === 'edit' ? {
      name: selectedPetData?.name,
      ownerName: selectedPetData?.ownerName,
      age: selectedPetData?.age,
      notes: selectedPetData?.notes,
      imageUrl: selectedPetData?.imageUrl
    } : undefined
  })

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()

  //   const formData = new FormData(e.currentTarget)
  //   const pet = Object.fromEntries(formData.entries())

  //   // const newPetData = {
  //   //   id: actionType === 'add' ? String(Date.now()) : selectedPetData?.id,
  //   //   ...pet,
  //   //   age: Number(pet.age),
  //   //   imageUrl:
  //   //     pet.imageUrl ||
  //   //     'https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png',
  //   // } as TPet

  //   // if(actionType === 'add') {
  //   //   handleAddPet(newPetData)
  //   // } else if (selectedPetData && actionType === 'edit') {
  //   //   handleEditPet(selectedPetData.id, newPetData)
  //   // } else return

  //   // onFormSubmission()

  //   const result = await trigger() // form fields validation, returns boolean
  //   if(!result) return

  //   onFormSubmission()

  //   const newPet = Object.fromEntries(formData.entries())
  //   const newPetData: TPet = {
  //     id: selectedPetData?.id || String(Date.now()),
  //     ...newPet,
  //     age: Number(newPet.age),
  //     imageUrl:
  //       newPet.imageUrl ||
  //       'https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png',
  //   } as TPet

  //   if (actionType === 'add') {
  //     await handleAddPet(newPetData)
  //   } else if (selectedPetData) {
  //     await handleEditPet(selectedPetData.id, newPetData)
  //   }
  // }

  return (
    <form
      className="flex flex-col "
      // onSubmit={handleSubmit}
      action={async () => {
        const result = await trigger() // form fields validation, returns boolean
        if(!result) return

        onFormSubmission()

        // const newPet = Object.fromEntries(formData.entries())
        const newPet = getValues()
        const newPetData: TPet = {
          ...newPet,
          id: selectedPetData?.id || String(Date.now()),
          age: newPet.age,
          imageUrl:
            newPet.imageUrl 
              || defaultImageUrl,
        }

        if (actionType === 'add') {
          await handleAddPet(newPetData)
        } else if (selectedPetData) {
          await handleEditPet(selectedPetData.id, newPetData)
        }

        // onFormSubmission() // that works without useOptimistic hook, only server actions of useContext
      }}
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register('name', {
              // required: 'Name is required!',
              // minLength: {
              //   value: 3,
              //   message: 'Name should be at least 3 symbols'
              // },
              // defaultValue: 
            })}
          />
          {errors.name && <p className='text-yellow-500'>{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            {...register('ownerName', {
              // required: 'Name is required!',
              // maxLength: {
              //   value: 30,
              //   message: 'Owner name should be max of 30 symbols'
              // }
            })}
          />
          {errors.ownerName && <p className='text-red-500'>{errors.ownerName.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input
            id="imageUrl"
            {...register('imageUrl')}
          />
          {errors.imageUrl && <p className='text-red-500'>{errors.imageUrl.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            {...register('age')}
            // name="age"
            // type="number"
            // required
            // defaultValue={actionType === 'edit' ? selectedPetData?.age : ''}
          />
          {errors.age && <p className='text-red-500'>{errors.age.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...register('notes')}
            // name="notes"
            // rows={3}
            // required
            // defaultValue={actionType === 'edit' ? selectedPetData?.notes : ''}
          />
          {errors.notes && <p className='text-red-500'>{errors.notes.message}</p>}
        </div>
      </div>

      <PetFormBtn
        {...{
          actionType,
        }}
      />
    </form>
  )
}
