/**
 * Resolves the backend API base URL with fallback to the production Render backend.
 * Normalizes trailing slashes so URL concatenation is always clean.
 */
export const getApiBaseUrl = (): string => {
  const url =
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:5000/api/v1";

  return url.replace(/\/+$/, "");
};

