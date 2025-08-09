'use client'
import { usePetContext } from '@/hooks/hooks'
import { TPet } from '@/lib/types'
// import { Pet as TPet } from '@prisma/client'
// import { checkoutPet } from '@/serverActions/actions'
import PetButton from 'components/PetButton'
import Image from 'next/image'
// import { useTransition } from 'react'

export default function PetDetails() {
  const { selectedPetData } = usePetContext()

  return (
    <section className="flex flex-col w-full h-full">
      {selectedPetData ? (
        <>
          <TopBar {...{ petData: selectedPetData }} />

          <OtherInfo {...{ petData: selectedPetData }} />

          <Notes {...{ petData: selectedPetData }} />
        </>
      ) : <EmptyView />}
    </section>
  )
}

function EmptyView() {
  return <div className='flex justify-center items-center h-full'>
    <p className='text-2xl font-medium'>No pet selected</p>
  </div>
}

function TopBar({ petData }: { petData: TPet }) {
  const { handleCheckoutPet } = usePetContext()
  // const [isPending, startTransitionFunc] = useTransition() // to catch pending status outside of form
  // console.log({isPending, startTransitionFunc})

  return (
    <div className="flex items-center bg-white px-8 py-5 border-b border-black1">
      <Image
        src={petData.imageUrl}
        alt={petData.name}
        height={75}
        width={75}
        className="h-[75px] w-[75px] rounded-full object-cover"
      />

      <h2 className="text-3xl font-semibold leading-7 ml-5">{petData.name}</h2>

      <div className='ml-auto space-x-2'>
        <PetButton actionType='edit'>Edit</PetButton>
        <PetButton 
          actionType='checkout' 
          // disabled={isPending}
          // onClick={() => handleCheckoutPet(petData.id)}
          onClick={async () => await handleCheckoutPet(petData.id)}
        >Checkout</PetButton>
      </div>
    </div>
  )
}

function OtherInfo({ petData }: { petData: TPet }) {
  return (
    <div className="flex justify-around py-10 px-5 text-center">
      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">
          Owner name
        </h3>
        <p className="mt-1 text-lg text-zinc-800">{petData.ownerName}</p>
      </div>

      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">Age</h3>
        <p className="mt-1 text-lg text-zinc-800">{petData.age}</p>
      </div>
    </div>
  )
}

function Notes({ petData }: { petData: TPet }) {
  return (
    <section className="bg-white px-7 py-5 rounded-md mb-9 mx-8 flex-1 border border-black1">
      {petData.notes}
    </section>
  )
}
