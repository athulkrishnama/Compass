import { env } from "@/config/env";
import { HTTP_STATUS_CODES } from "@/constants/HTTPStatusCodes";
import { ROLES } from "@/constants/roles";
import { AUTH_ROUTES } from "@/constants/routes/authRoutes";
import { router } from "@/main";
import { removeToken, setToken } from "@/store/slices/tokenSlice";
import { removeUser } from "@/store/slices/userSlice";
import { store } from "@/store/store";
import axios from "axios";
import { toast } from "sonner";

export const axiosInstance = axios.create({
    baseURL: env.VITE_BASEURL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(function (config) {
    if (store.getState().token.accessToken) {
        config.headers.Authorization =
            "Bearer " + store.getState().token.accessToken;
    }
    if (store.getState().lang.lang) {
        config.headers["Accept-Language"] = store.getState().lang.lang;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        if (
            err.response.status === HTTP_STATUS_CODES.FORBIDDEN &&
            err.response.data.error === "blocked"
        ) {
            const role = store.getState().user.role;
            toast.error(err.response.data.message);
            store.dispatch(removeUser());
            router.navigate({
                to:
                    role === ROLES.HOTEL
                        ? "/hotel/login"
                        : role === ROLES.CAB
                          ? "/cab/login"
                          : "/traveler/login",
            });
        }

        if (
            err.response.status === HTTP_STATUS_CODES.UNAUTHORIZED &&
            err.response.data.error === "invalidToken" &&
            !originalRequest.retry
        ) {
            try {
                originalRequest.retry = true;
                const response = await axiosInstance.post(AUTH_ROUTES.REFRESH);
                originalRequest.headers.Authorization =
                    "Bearer " + response.data.data.accessToken;
                store.dispatch(setToken(response.data.data.accessToken));
                return axiosInstance(originalRequest);
            } catch (error) {
                void error;
                const role = store.getState().user.role;
                store.dispatch(removeToken());
                store.dispatch(removeUser());

                let url = "";
                if (role === ROLES.ADMIN) url = "/admin/login";
                else if (role === ROLES.CAB) url = "/cab/login";
                else if (role === ROLES.HOTEL) url = "/hotel/login";
                else url = "/traveler/login";

                window.location.href = url;
            }
        } else {
            return Promise.reject(err);
        }
    }
);
