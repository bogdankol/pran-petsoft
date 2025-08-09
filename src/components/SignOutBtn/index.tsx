'use client'

import { Button } from '@/components/ui/button'
import { signOutFunc } from '@/serverActions/actions'
import { useTransition } from 'react'

export default function SignOutBtn() {
  const [isPending, startTransitionFunc] = useTransition()
  return (
    <Button
      disabled={isPending}
      onClick={async () => startTransitionFunc(async () => await signOutFunc())}
    >
      Sign out
    </Button>
  )
}
