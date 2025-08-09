import AuthForm from 'components/AuthForm'
import H1 from 'components/H1'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <main>
      <H1 className='text-center'>Log In</H1>

      <AuthForm type='login' />

      <p className='mt-6 text-zinc-500 mt-6 text-sm'>
        No account yet?{' '}
        <Link href='/signup' className='font-medium'>
          Sign up
        </Link>
      </p>
    </main>
  )
}
