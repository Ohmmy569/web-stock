import { ZodError } from 'zod';

export async function parseJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    badRequestException('Invalid JSON body');
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof ZodError) {
    const errorMessages = error.issues.map((err) => err.message);
    return new Response(
      JSON.stringify({ message: 'Validation Error', errors: errorMessages }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  if (error instanceof Error) {
    const errorMessage = JSON.parse(error.message);
    if (errorMessage.status && errorMessage.status === 404) {
      return new Response(JSON.stringify({ message: errorMessage.message }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (errorMessage.status && errorMessage.status === 401) {
      return new Response(JSON.stringify({ message: errorMessage.message }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (errorMessage.status && errorMessage.status === 400) {
      return new Response(JSON.stringify({ message: errorMessage.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
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

export function notFoundException(message: string) {
  const error = {
    message: message,
    status: 404,
  };
  throw new Error(JSON.stringify(error));
}

export function unauthorizedException(message: string) {
  const error = {
    message: message,
    status: 401,
  };
  throw new Error(JSON.stringify(error));
}

export function badRequestException(message: string) {
  const error = {
    message: message,
    status: 400,
  };
  throw new Error(JSON.stringify(error));
}
