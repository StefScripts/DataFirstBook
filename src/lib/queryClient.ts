import { QueryClient } from '@tanstack/react-query';
import { apiFetch } from './api-client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        // Use the first part of the query key as the API path
        const path = queryKey[0] as string;
        return apiFetch(path);
      },
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false
    },
    mutations: {
      retry: false
    }
  }
});
