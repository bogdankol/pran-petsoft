import z from 'zod';
import { defaultImageUrl } from './constants';

export const PetFormSchema = z.object({          // errors work both with onSubmit and action, but coerce and transform don't
  name: z.string().trim().min(3, { error: 'Name is required!AAA'}).max(12),
  ownerName: z.string().trim().min(3, { error: 'ownerName is requiredAAAA!'}).max(100),
  imageUrl: z.union([
    z.literal(``),
    z.string().trim().url({ message: 'imageUrl should be validAAAAA'})
  ]),
  age: z.coerce.number().int().positive().max(100),
  notes: z.union([
    z.literal(``),
    z.string().trim().max(1010)
  ]),
})
  .transform(data => ({
    ...data,
    imageUrl: data.imageUrl || defaultImageUrl,
  }))

export const petIdSchema = z.string()

export type TPetForm = z.infer<typeof PetFormSchema>

export const AuthSchema = z.object({          // errors work both with onSubmit and action, but coerce and transform don't
  email: z.string().email().max(100),
  password: z.string().max(100)
})

export type TAuth = z.infer<typeof AuthSchema>