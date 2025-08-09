'use client'
import { Button } from '@/components/ui/button'
import { useFormStatus } from 'react-dom'

export default function AuthFormBtn({ type }: { type: 'login' | 'signup' }) {
  const {
    pending
  } = useFormStatus()

  console.log({pending})
  return (
    <Button className="mt-4" disabled={pending}>
      {type === 'login' ? 'Log in' : 'Sign Up'}
    </Button>
  )
}
