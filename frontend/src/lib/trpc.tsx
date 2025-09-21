import { env } from "./env";
import type { TrpcRouter } from "@ideanick/backend/src/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink, type TRPCLink } from "@trpc/client";
import { createTRPCReact, type CreateTRPCReact } from "@trpc/react-query";
import Cookies from "js-cookie";
import superjson from "superjson";
import { sentryCaptureException } from "./sentry";
import { observable } from "@trpc/server/observable";

export const trpc: CreateTRPCReact<TrpcRouter, undefined> = createTRPCReact<TrpcRouter, undefined>();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const customTrpcLink: TRPCLink<TrpcRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      const unsubscribe = next(op).subscribe({
        next(value) {
          observer.next(value);
        },
        error(error) {
          if (!error.data?.isExpected) {
            sentryCaptureException(error);
            if (env.NODE_ENV !== "development") {
              console.error(error);
            }
          }
          observer.error(error);
        },
        complete() {
          observer.complete();
        },
      });
      return unsubscribe;
    });
  };
};

const backendUrl = import.meta.env.PROD ? "/trpc" : env.VITE_BACKEND_TRPC_URL;

const trpcClient = trpc.createClient({
  links: [
    customTrpcLink,
    loggerLink({
      enabled: () => env.NODE_ENV === "development",
    }),
    httpBatchLink({
      url: backendUrl,
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
