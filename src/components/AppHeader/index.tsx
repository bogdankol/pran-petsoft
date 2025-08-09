'use client'

import { cn } from '@/lib/client-utils'
import Logo from 'components/Logo'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const routes = [
  {
    label: 'Dashboard',
    path: `/app/dashboard`,
  },
  {
    label: 'Account',
    path: `/app/account`,
  },
]

export default function AppHeader() {
  const pathname = usePathname()

  return (
    <header className="flex justify-between items-center border-b border-white/10 py-2 ">
      <Logo />

      <nav>
        <ul className={`flex gap-2 text-md`}>
          {routes.map((route: { label: string; path: string }) => (
            <li key={route.path}>
              <Link
                href={route.path}
                className={cn(
                  `text-white/70 rounded-sm px-2 py-1 hover:text-white focus:text-white transition`,
                  {
                    'bg-black/10 text-white': pathname === route.path,
                  }
                )}
              >
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
