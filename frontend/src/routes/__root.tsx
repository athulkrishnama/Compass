import { setLanguage } from "@/store/slices/langSlice";
import { store } from "@/store/store";
import  {type Langtype, Languages } from "@/types/langType";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import i18next from "i18next";
import { useEffect } from "react";

const RootLayout = () => {
    useEffect(() => {
        let lang: Langtype = store.getState().lang.lang;
        if (!lang) {
            lang = navigator?.language.slice(0, 2) as Langtype;
            if (!Languages.includes(lang as Langtype)) {
                lang = Languages[0];
            }
            store.dispatch(setLanguage(lang));
        }
        i18next.changeLanguage(lang);
        document.documentElement.setAttribute("lang", lang);
    }, []);
    return (
        <>
            <Outlet />
            <TanStackRouterDevtools />
        </>
    );
};
export const Route = createRootRoute({ component: RootLayout });
