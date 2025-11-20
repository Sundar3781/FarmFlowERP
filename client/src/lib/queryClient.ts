import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Get user from localStorage for audit logging
  const userStr = localStorage.getItem("farm-user");
  const user = userStr ? JSON.parse(userStr) : null;

  const headers: Record<string, string> = data ? { "Content-Type": "application/json" } : {};
  if (user?.id) {
    headers["x-user-id"] = user.id;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Get user from localStorage for audit logging
    const userStr = localStorage.getItem("farm-user");
    const user = userStr ? JSON.parse(userStr) : null;

    const headers: Record<string, string> = {};
    if (user?.id) {
      headers["x-user-id"] = user.id;
    }

    // Build URL from queryKey, handling objects as query params
    const pathSegments: string[] = [];
    const params: string[] = [];
    
    for (const segment of queryKey) {
      if (typeof segment === "string") {
        pathSegments.push(segment);
      } else if (typeof segment === "number" || typeof segment === "boolean") {
        // Include primitive values in the path
        pathSegments.push(String(segment));
      } else if (typeof segment === "object" && segment !== null) {
        // Convert object to query parameters
        for (const [key, value] of Object.entries(segment)) {
          if (value !== undefined && value !== null) {
            params.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
          }
        }
      }
    }
    
    // Join path segments and ensure proper leading slash
    let url = pathSegments.join("/");
    if (!url.startsWith("/")) {
      url = "/" + url;
    }
    
    if (params.length > 0) {
      url += "?" + params.join("&");
    }

    const res = await fetch(url, {
      credentials: "include",
      headers,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
