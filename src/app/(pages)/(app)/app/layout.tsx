import AppFooter from 'components/AppFooter'
import AppHeader from 'components/AppHeader'
import BackgroundPattern from 'components/BackgroundPattern'
import PetContextProvider from '@/contexts/pet-context-provider'
import SearchContextProvider from '@/contexts/search-context-provider'
import { Toaster } from '@/components/ui/sonner'
import { checkAuth, getPetsByUserId } from '@/lib/server-utils'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await checkAuth()

  console.log({session})
    
  const allPets = await getPetsByUserId(session.user.id)

  return (
    <>
      <BackgroundPattern />

      <div className={`max-w-[1050px] mx-auto px-4 flex flex-col min-h-screen`}>
        <AppHeader />

        <PetContextProvider data={allPets}>
          <SearchContextProvider>
            {children}
          </SearchContextProvider>
        </PetContextProvider>

        <AppFooter />
      </div>

      <Toaster position='top-right' />
    </>
  )
}
