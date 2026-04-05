const apiBaseFromEnv = import.meta.env.VITE_API_URL?.trim() ?? '';

// Keep base URL stable regardless of trailing slash in .env.
export const apiBaseUrl = apiBaseFromEnv.replace(/\/+$/, '');

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
}
