'use client'

import { Button } from '@/components/ui/button'
import { createCheckoutSession, refreshUserSession } from '@/serverActions/actions'
import GiveAccessBtn from 'components/GiveAccessBtn'
import H1 from 'components/H1'
import { useSearchParams } from 'next/navigation'
import { useTransition, Suspense } from 'react'

export default function PaymentPage() {
  return <Suspense>
    <PaymentPageContent />
  </Suspense>
}

function PaymentPageContent() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled') !== null
  const [pendingStatus, transitionStartFunc] = useTransition()

  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>PetSoft access requires payment</H1>

      {success && (
        <div className="flex flex-col justify-center items-center space-y-5">
          <p className="text-green-700 font-medium text-base">
            Thank you for your purchase. You now have a lifetime access
          </p>
          <GiveAccessBtn />
        </div>
      )}

      {canceled && (
        <div className="flex flex-col justify-center items-center space-y-5">
          <p className="text-red-700 font-medium text-base">
            Payment canceled. you can try again by following the link below
          </p>
          <Button
            disabled={pendingStatus}
            onClick={async () => {
              transitionStartFunc(async () => await createCheckoutSession())
            }}
          >
            Try again
          </Button>
        </div>
      )}

      {!success && !canceled && (
        <Button
          disabled={pendingStatus}
          onClick={async () => {
            transitionStartFunc(async () => await createCheckoutSession())
          }}
        >
          Buy lifetime access for $299
        </Button>
      )}
    </main>
  )
}
