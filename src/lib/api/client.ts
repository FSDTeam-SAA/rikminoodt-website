import { getApiBaseUrl } from "@/config/api";

interface ApiResponse<T> {
  data: T;
  message: string;
}

const getErrorMessage = (payload: unknown) => {
  if (typeof payload === "object" && payload !== null && "message" in payload) {
    const message = (payload as { message?: unknown }).message;
    return Array.isArray(message) ? message[0] : message;
  }

  return undefined;
};

export async function apiRequest<T>(
  path: string,
  accessToken: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload) || "Something went wrong. Please try again.");
  }

  return payload as ApiResponse<T>;
}
