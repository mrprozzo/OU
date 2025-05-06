import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  options?: RequestInit,
): Promise<any> {
  const defaultOptions: RequestInit = {
    method: 'GET',
    headers: {},
    credentials: "include"
  };

  // Merge default options with provided options
  const mergedOptions = { ...defaultOptions, ...options };
  
  // If there's data in the body and it's not already a string, stringify it
  if (options?.body && typeof options.body === 'object') {
    mergedOptions.body = JSON.stringify(options.body);
    
    // Ensure we have a Content-Type header if sending JSON
    if (!mergedOptions.headers) {
      mergedOptions.headers = {};
    }
    
    if (!('Content-Type' in (mergedOptions.headers as Record<string, string>))) {
      (mergedOptions.headers as Record<string, string>)['Content-Type'] = 'application/json';
    }
  }

  // Make the request
  const res = await fetch(url, mergedOptions);
  
  // Check if the response is OK
  await throwIfResNotOk(res);
  
  // Parse and return the JSON response
  return await res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
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
