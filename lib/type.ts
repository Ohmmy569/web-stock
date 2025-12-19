import { enumRoles } from '@/db/schema';
import z from 'zod';
export type createUserType = {
  email: string;
  password: string;
  role: typeof enumRoles;
};

export const createUserBodySchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .email('Invalid email address'),
  password: z
    .string({ message: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
  role: z.enum(enumRoles.enumValues, {
    message: 'Invalid role',
  }),
});

export type createUserBodyType = z.infer<typeof createUserBodySchema>;
