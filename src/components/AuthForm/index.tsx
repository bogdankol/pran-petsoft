'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login, signUp } from '@/serverActions/actions'
import AuthFormBtn from 'components/AuthFormBtn'
import { useFormState } from 'react-dom'

export default function AuthForm({ type }: { type: 'login' | 'signup' }) {

  const [error, loginOrSIgnUpFunc, pending] = useFormState(type === 'login' ? login : signUp, null)
  return (
    <form 
      className="mt-5" 
      action={loginOrSIgnUpFunc}
    >
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input name="email" id="email" required maxLength={100} />
      </div>
      <div className="space-y-1 mt-2">
        <Label htmlFor="password">Password</Label>
        <Input name="password" id="password" type='password' required  maxLength={100} />
      </div>

      <AuthFormBtn type={type} />

      {error && <p className='text-red-500 text-sm mt-5'>{error.message}</p>}
    </form>
  )
}
