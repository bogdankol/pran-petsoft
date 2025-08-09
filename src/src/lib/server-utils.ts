import 'server-only'

import { redirect } from 'next/navigation'
import { auth } from './auth'
import { TPet, TUser } from './types'
import prisma from '@/lib/db'

export async function checkAuth() {
  const session = await auth()
  if (!session?.user) return redirect('/login')
  return session
}

export async function getPetById(petId: TPet['id']) {
  const pet = await prisma.pet.findUnique({
    where: {
      id: petId,
    },
  })

  return pet
}

export async function getPetsByUserId(userId: TUser['id']) {
  const pets = await prisma.pet.findMany({
    where: {
      userId
    },
  })

  return pets
}

export async function getUserByEmail(email: TUser['email']) {
  const user = await prisma.user.findUnique({
    where: {
      email
    },
  })

  return user
}