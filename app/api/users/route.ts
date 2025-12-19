import { db } from '@/db/index';
import { users } from '@/db/schema';
import * as brypt from 'bcryptjs';
import { createUserBodySchema } from '@/lib/type';
import { ZodError } from 'zod';
import { parseJsonBody, returnErrorResponse } from '@/lib/helper-function';
export async function GET() {
  const allUsers = await db.select().from(users);
  return new Response(
    JSON.stringify({
      message: 'Users retrieved successfully',
      data: allUsers,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody(request);
    const validatedBody = createUserBodySchema.safeParse(body);

    if (!validatedBody.success) {
      throw new ZodError(validatedBody.error.issues);
    }

    const { email, password, role } = validatedBody.data;
    const hashedPassword = await brypt.hash(password, 10);

    const newUser = await db
      .insert(users)
      .values({ email, password: hashedPassword, role })
      .returning();

    return new Response(
      JSON.stringify({
        message: 'User created successfully',
        data: newUser,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return returnErrorResponse(error);
  }
}
