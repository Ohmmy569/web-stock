import { db } from '@/db/index';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as brypt from 'bcryptjs';
import { loginBodySchema } from '@/utils/type';
import { ZodError } from 'zod';
import {
  parseJsonBody,
  errorResponse,
  notFoundException,
  unauthorizedException,
} from '@/utils/helper-function';

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
