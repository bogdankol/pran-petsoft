// export type TPet = {
//   id: string
//   name: string
//   ownerName: string
//   imageUrl: string
//   age: number
//   notes: string
// }

import { Pet, User } from '@prisma/client'

export type TPet = Omit<Pet, "createdAt" | 'updatedAt' | 'userId'>
export type TUser = Omit<User, "createdAt" | 'updatedAt'>