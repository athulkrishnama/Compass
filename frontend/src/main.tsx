import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { routeTree } from "./routeTree.gen.ts";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/tanstackQueryConfig.ts";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import "@/utils/i18n";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { isLoggedin, roleChecker } from "./utils/authChecker.ts";
import { env } from "./config/env.ts";

export const router = createRouter({
    routeTree,
    context: { queryClient, checkRole: roleChecker, isLoggedin: isLoggedin },
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={env.VITE_GOOGLE_CLIENT_ID}>
            <QueryClientProvider client={queryClient}>
                <Provider store={store}>
                    <PersistGate persistor={persistor}>
                        <RouterProvider router={router} />
                    </PersistGate>
                </Provider>
                <ReactQueryDevtools />
            </QueryClientProvider>
            <Toaster position="top-right" />
        </GoogleOAuthProvider>
    </StrictMode>
);
