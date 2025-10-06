import { axiosInstance } from "@/axios/instance";
import { AUTH_ROUTES } from "@/constants/routes/authRoutes";
import { AxiosError } from "axios";

export async function userSignupSendOTP<T>(data: T) {
    try {
        const response = await axiosInstance.post(AUTH_ROUTES.SIGNUP, data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.error);
        }
        throw new Error("something went wrong");
    }
}

export async function userVerifyOtp<T>(data: T) {
    try {
        const response = await axiosInstance.post(AUTH_ROUTES.VERIFY_OTP, data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.error);
        }
        throw new Error("something went wrong");
    }
}

export async function userResendOtp<T>(data: T) {
    try {
        const response = await axiosInstance.post(AUTH_ROUTES.RESEND_OTP, {
            email: data,
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.error);
        }
        throw new Error("something went wrong");
    }
}

export async function userLogin<T>(data: T) {
    try {
        const response = await axiosInstance.post(AUTH_ROUTES.LOGIN, data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.error);
        }
        throw new Error("something went wrong");
    }
}
