import { AUTH_ROUTES } from "@/constants/routes/authRoutes";
import { store } from "@/store/store";
import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASEURL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(function (config) {
    if (store.getState().token.accessToken) {
        config.headers.Authorization =
            "Bearer " + store.getState().token.accessToken;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        if (
            err.response.status === 401 &&
            err.response.data.error === "Invalid Token" &&
            !originalRequest.retry
        ) {
            try {
                originalRequest.retry = true;
                const response = await axiosInstance.post(AUTH_ROUTES.REFRESH);
                originalRequest.headers.Authorization =
                    "Bearer " + response.data.data.accessToken;
                return axiosInstance(originalRequest);
            } catch (error) {
                console.log(error);
            }
        }
    }
);
