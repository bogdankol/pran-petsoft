'use client'

import { Button } from '@/components/ui/button'
import { refreshUserSession } from '@/serverActions/actions'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export default function GiveAccessBtn() {
  const [isPending, startTransitionFunc] = useTransition()
  const router = useRouter()
  return (
    <Button
      disabled={isPending}
      onClick={async () => {
        startTransitionFunc(async () => {
          await refreshUserSession()
          router.push('/app/dashboard')
        })
      }}
    >
      go to Dashboard
    </Button>
  )
}
