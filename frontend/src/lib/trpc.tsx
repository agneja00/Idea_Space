import type { TrpcRouter } from "@ideanick/backend/src/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact, type CreateTRPCReact } from "@trpc/react-query";
import Cookies from "js-cookie";
import superjson from "superjson";
import { env } from "./env";

export const trpc: CreateTRPCReact<TrpcRouter, undefined> = createTRPCReact<TrpcRouter, undefined>();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const trpcClient = trpc.createClient({
  links: [
    loggerLink({
      enabled: () => env.NODE_ENV === "development",
    }),
    httpBatchLink({
      url: env.VITE_BACKEND_TRPC_URL,
      transformer: superjson,
      headers: () => {
        const token = Cookies.get("token");
        return {
          ...(token && { authorization: `Bearer ${token}` }),
        };
      },
    }),
  ],
});

export const TrpcProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
