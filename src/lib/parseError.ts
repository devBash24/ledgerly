import { AxiosError } from 'axios';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ZodError } from 'zod';

type ErrorWithMessage = {
  message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example
    return new Error(String(maybeError));
  }
}

export function parseError(error: unknown): string {
  // Handle Axios errors
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    // If the error response has a message field, use it
    if (data && typeof data === 'object' && ('message' in data || 'error' in data)) {
      return String(data.message || data.error);
    }
    // If there's a status text, use it
    if (error.response?.statusText) {
      return `Request failed: ${error.response.statusText}`;
    }
    // Fallback to the error message
    return error.message;
  }

  // // Handle Prisma errors
  // if (error instanceof PrismaClientKnownRequestError) {
  //   switch (error.code) {
  //     case 'P2002':
  //       return 'This record already exists.';
  //     case 'P2014':
  //       return 'The change you are trying to make would violate database constraints.';
  //     case 'P2003':
  //       return 'Invalid input data.';
  //     case 'P2025':
  //       return 'Record not found.';
  //     case 'P2018':
  //       return 'Required related record was not found.';
  //     default:
  //       return `Database error: ${error.message}`;
  //   }
  // }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const errors = error.errors.map((e) => e.message);
    return errors.join(', ');
  }

  // Handle standard errors
  if (error instanceof Error) {
    return error.message;
  }

  // Handle unknown errors
  return toErrorWithMessage(error).message;
}

// Example usage with type safety
export function handleError(error: unknown): { message: string; status?: number } {
  const message = parseError(error);
  let status: number | undefined;

  if (error instanceof AxiosError) {
    status = error.response?.status;
  }

  return { message, status };
}
