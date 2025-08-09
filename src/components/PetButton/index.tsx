'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PlusIcon } from '@radix-ui/react-icons'
import PetForm from 'components/PetForm'
import { ReactNode, useState } from 'react'
import { flushSync } from 'react-dom'

export default function PetButton({
  actionType,
  children,
  onClick,
  disabled
}: {
  actionType: 'add' | 'edit' | 'checkout'
  children?: ReactNode 
  onClick?: () => void
  disabled?: boolean
}) {
  const [isFormOpened, setIsFormOpened] = useState(false)

  if(actionType === 'checkout') 
    return <Button variant={'secondary'} onClick={onClick} disabled={disabled} >{children}</Button>
  
  return <Dialog open={isFormOpened} onOpenChange={setIsFormOpened}>
    <DialogTrigger asChild>
      {actionType === 'add' 
        ? <Button size='icon' onClick={onClick}>
            <PlusIcon className='h-6 w-6'/>
          </Button>
        : <Button variant={'secondary'} onClick={onClick}>{children}</Button>
      }
    </DialogTrigger>
    <DialogContent>
      
      <DialogHeader>
        <DialogTitle>
          {actionType === 'add' ? 'Add a new pet' : 'Edit pet'}
        </DialogTitle>

        <PetForm {...{ 
          actionType, 
          onFormSubmission: () => {
            flushSync(() => {
              setIsFormOpened(false) 
            })
          }
        }} />
      </DialogHeader>
    </DialogContent>
  </Dialog>
}
