import * as brypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { ZodError } from 'zod';

import { db } from '@/db/index';
import { users } from '@/db/schema';
import {
  errorResponse,
  notFoundException,
  parseJsonBody,
  unauthorizedException,
} from '@/utils/helper-function';
import { loginBodySchema } from '@/utils/type';

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody(request);
    const validatedBody = loginBodySchema.safeParse(body);

    if (!validatedBody.success) {
      throw new ZodError(validatedBody.error.issues);
    }

    const { email, password } = validatedBody.data;
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw notFoundException('User not found');
    }
    const isPasswordValid = await brypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw unauthorizedException('Invalid password');
    }
    return new Response(
      JSON.stringify({
        message: 'Login successful',
        data: { id: user.id, email: user.email, role: user.role },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
