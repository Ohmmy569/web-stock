import { ZodError } from 'zod';

export async function parseJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new Error('INVALID_JSON');
  }
}

export function returnErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    if (error instanceof Error && error.message === 'INVALID_JSON') {
      return new Response(
        JSON.stringify({
          message: 'Invalid JSON body',
          error: 'Request body must be valid JSON',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    const errorMessages = error.issues.map((err) => err.message);
    return new Response(
      JSON.stringify({ message: 'Validation Error', errors: errorMessages }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  console.error('[API Error]', {
    timestamp: new Date().toISOString(),
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
  });

  return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}
