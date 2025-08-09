import React from 'react'
import Logo from 'components/Logo'

export default function layout({children}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex flex-col justify-center gap-y-5 items-center min-h-screen'>
      <Logo />
      {children}
    </div>
  )
}
