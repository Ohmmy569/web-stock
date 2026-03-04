import { db } from '@/db/index';
import { users } from '@/db/schema';
import * as brypt from 'bcryptjs';
import { createUserBodySchema } from '@/utils/type';
import { ZodError } from 'zod';
import { parseJsonBody, errorResponse } from '@/utils/helper-function';

/**
 * @swagger
 * /api/users:
 * get:
 * summary: Retrieve a list of users
 * tags: [Users]
 * responses:
 * 200:
 * description: A list of users
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * data:
 * type: array
 * items:
 * type: object
 * properties:
 * id:
 * type: string
 * email:
 * type: string
 * role:
 * type: string
 * createOn:
 * type: string
 * updateOn:
 * type: string
 * post:
 * summary: Create a new user
 * tags: [Users]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * password:
 * type: string
 * responses:
 * 201:
 * description: User created successfully
 */

export async function GET() {
  const allUsers = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      createOn: users.createOn,
      updateOn: users.updateOn,
    })
    .from(users);
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
        data: {
          ...newUser[0],
          password: undefined,
        },
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
