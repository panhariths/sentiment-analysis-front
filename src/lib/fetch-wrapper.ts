import { cookies } from "next/headers";

export type ErrorData = {
  message: string;
  code?: number;
  suggestion?: string;
};

export type FetchApiResult<T = unknown> =
  | {
      data: T;
      error?: never;
    }
  | {
      error: ErrorData;
      data?: never;
    };

export async function fetchRequest<T = unknown>(
  endpoint: string,
  fetchOptions?: RequestInit
): Promise<T> {
  const response = await fetch(endpoint, {
    ...fetchOptions,
  });

  const body = await response.json();

  return body;
}
