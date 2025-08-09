import AuthForm from 'components/AuthForm'
import H1 from 'components/H1'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <main>
      <H1 className='text-center'>Sign up</H1>

      <AuthForm type='signup' />

      <p className='mt-6 text-zinc-500 mt-6 text-sm'>
        Already have an account?{' '}
        <Link href='/login' className='font-medium'>
          Log In
        </Link>
      </p>
    </main>
  )
}
