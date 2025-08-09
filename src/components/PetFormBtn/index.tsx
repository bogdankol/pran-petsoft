import { Button } from '@/components/ui/button'
import React from 'react'

export default function PetFormBtn({
  actionType,
}: {
  actionType: 'add' | 'edit'
}) {
  return (
    <Button type="submit" className="mt-5 self-end">
      {actionType === 'add' ? 'Add a new pet' : 'Edit pet'}
    </Button>
  )
}
