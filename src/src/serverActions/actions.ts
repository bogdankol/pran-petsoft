'use server'

// import { TPet } from '@/lib/types'
// import { Pet as TPet } from '@prisma/client'
import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { sleep } from '@/lib/client-utils'
import { PetFormSchema, petIdSchema, TAuth, AuthSchema } from '@/lib/validations'
import { auth, signIn, update } from '@/lib/auth'
import { signOut } from '@/lib/auth'
import bcrypt from 'bcryptjs'
// import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { checkAuth, getPetById } from '@/lib/server-utils'
import { Prisma } from '@prisma/client'
import { AuthError } from 'next-auth'
import Stripe from 'stripe' 

// payment actions
export async function createCheckoutSession() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-07-30.basil', // explicitly set version
  })
  const session = await checkAuth()

  console.log('I AM createCheckoutSession')

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      // @ts-expect-error some issue with typescript but data is valid
      customer_email: session.user.email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/payment?success=true`,
      cancel_url: `${process.env.BASE_URL}/payment?canceled=false`
    })
    // console.log({checkoutSession, stripe})

    if (checkoutSession?.url) {
      // redirection to stripe checkout page
      redirect(checkoutSession?.url)
    }


  } catch(err: unknown) {
    console.log('ERROR in obtaining stripe session:', {err})
    throw err
  }
  
}

export async function refreshUserSession() {
  const session = await auth()
  if (!session) return

  // Это вызовет `trigger: 'update'` в `jwt` и `session` callbacks
  await update({
    user: {
      hasAccess: session.user.hasAccess, // можно передать что-то, но не обязательно
    },
  })
}

// user actions
export async function signUp(prevState: unknown, authData: unknown) {
  console.log({prevState})

  if(!(authData instanceof FormData)) return {
    message: 'Invalid form data'
  }

  const data = Object.fromEntries(authData.entries())

  const validatedData = AuthSchema.safeParse(data)
  if(!validatedData.success) return {
    message: 'Invalid data signup'
  }

  const hashedPassword = await bcrypt.hash(String(validatedData.data.password), 10)

  try {
    await prisma.user.create({
      data: {
        email: validatedData.data.email,
        hashedPassword,
      },
    })
  } catch (err: unknown) {
    console.error('User creation error:', err instanceof Error ? err.message : err)

    if(err instanceof Prisma.PrismaClientKnownRequestError) {
      if(err.code === 'P2002') {
        return {
          message: 'email already registered'
        }
      }
    }
    return {
      message: 'error during user creation'
    }
  }

  try {
    await signIn('credentials', {...validatedData.data, redirect: false})
    redirect('/payment')
  } catch (err: unknown) {
    console.error('User creation error:', err instanceof Error ? err.message : err)

    if(err instanceof AuthError) {
      switch(err.type) {
        case 'CredentialsSignin': return {
          message: 'credentials error'
        }
        default: return {
          message: 'signin error'
        }
      }
    }

    throw err // NEXT_REDIRECT error, we have to throw it for redirects to work
    // return {
    //   message: 'error during user login after creation'
    // }
  }
}

export async function signOutFunc() {
  await signOut({ redirectTo: '/' })
}

export async function login(_: unknown, authData: unknown) {
  if(!(authData instanceof FormData)) return {
    message: 'Invalid form data'
  }

  const data = Object.fromEntries(authData.entries()) as {
    email: string
    password: string
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email
      }
    })
    await signIn('credentials', {...data, redirect: false})
    if(user?.hasAccess) {
      redirect('/app/dashboard')
    } else {
      redirect('/payment')
    }
  } catch (err: unknown) {
    console.error('User signinnn error:', err instanceof Error ? err.message : err)

    if(err instanceof AuthError) {
      switch(err.type) {
        case 'CredentialsSignin': return {
          message: 'credentials error'
        }
        default: return {
          message: 'signin error'
        }
      }
    }

    throw err // NEXT_REDIRECT error, we have to throw it for redirects to work
    // return {
    //   message: 'error during user login'
    // }
  }
}

// Pet actions
export async function addPet(newPetData: unknown) {
  const session = await checkAuth()

  const validatedPet = PetFormSchema.safeParse(newPetData)
  if (!validatedPet.success)
    return {
      message: 'some data is missing or invalid',
    }
  console.log({ validatedPet, newPetData })

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
        // userId: session.user.id
      },
    })

    revalidatePath('/app', 'layout')
  } catch (_: unknown) {
    return {
      message: 'Couldn`t add pet',
    }
  }
}

export async function editPet(petId: unknown, newPetData: unknown) {
  // auth check
  const session = await checkAuth()

  // validation
  const validatedPet = PetFormSchema.safeParse(newPetData)
  const validatedId = petIdSchema.safeParse(petId)

  if (!validatedPet.success || !validatedId.success)
    return {
      message: 'some data is missing or invalid edit',
    }
  console.log({ validatedPet, newPetData, validatedId })

  // authorization (rights to delete that specific item) check
  try {
    const pet = await getPetById(validatedId.data)

    if (!pet)
      return {
        message: 'Pet not found',
      }

    if (pet.userId !== session.user.id)
      return {
        message: 'Not authorized to edit that pet',
      }
  } catch (_: unknown) {
    return {
      message: 'Error during checking pet for deletion',
    }
  }

  // mutation
  try {
    await prisma.pet.update({
      data: validatedPet.data,
      where: {
        id: validatedId.data,
      },
    })

    revalidatePath('/app', 'layout')
  } catch (_: unknown) {
    return {
      message: 'Couldn`t edit pet',
    }
  }
}

export async function checkoutPet(petId: unknown) {
  // auth check
  const session = await checkAuth()

  // validation
  const validatedId = petIdSchema.safeParse(petId)

  if (!validatedId.success)
    return {
      message: 'petId is invalid',
    }
  console.log({ validatedId })

  // authorization (rights to delete that specific item) check
  try {
    const pet = await getPetById(validatedId.data)

    if (!pet)
      return {
        message: 'Pet not found',
      }

    if (pet.userId !== session.user.id)
      return {
        message: 'Not authorized to delete that pet',
      }
  } catch (_: unknown) {
    return {
      message: 'Error during checking pet for deletion',
    }
  }

  // db mutation
  try {
    await prisma.pet.delete({
      where: {
        id: validatedId.data,
      },
    })

    revalidatePath('/app', 'layout')
  } catch (_: unknown) {
    return {
      message: 'Couldn`t delete a pet',
    }
  }
}
