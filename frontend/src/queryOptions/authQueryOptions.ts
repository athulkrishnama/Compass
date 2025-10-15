import {
    forgetPasswordResetPassword,
    forgetPasswordSendOtp,
    forgetPasswordVerifyOtp,
    googleLogin,
    logOutUser,
    userLogin,
    userResendOtp,
    userSignupSendOTP,
    userVerifyOtp,
} from "@/services/api/authApiService";
import {
    type ForgetPasswordPasswordResetRequest,
    type ForgetPasswordVerifyOtpRequest,
    type GoogleLoginRequest,
    type loginRequest,
    type OtpVerifyRequest,
    type signupRequest,
} from "@/types/api/requests/authRequests";
import type { loginResponse } from "@/types/api/responses/loginReponse";
import type { HttpResponse } from "@/types/api/responseType";
import { mutationOptions } from "@tanstack/react-query";

export function createSignupQueryOptions() {
    return mutationOptions<HttpResponse<{}>, Error, signupRequest>({
        mutationFn: (data) => userSignupSendOTP(data),
    });
}

export function createVerifySignupOtpQueryOptions() {
    return mutationOptions<HttpResponse<{}>, Error, OtpVerifyRequest>({
        mutationFn: (data) => userVerifyOtp(data),
    });
}

export function createResendOtpQueryOptions() {
    return mutationOptions<HttpResponse<{}>, Error, string>({
        mutationFn: (data) => userResendOtp(data),
    });
}

export function createLoginQueryOption() {
    return mutationOptions<HttpResponse<loginResponse>, Error, loginRequest>({
        mutationFn: (data) => userLogin(data),
    });
}

export function createForgetPasswordSendOtpQueryOptions() {
    return mutationOptions<HttpResponse<{}>, Error, string>({
        mutationFn: (data) => forgetPasswordSendOtp(data),
    });
}

export function createForgetPasswordVerifyOtpQueryOptions() {
    return mutationOptions<
        HttpResponse<{ token: string }>,
        Error,
        ForgetPasswordVerifyOtpRequest
    >({
        mutationFn: (data) => forgetPasswordVerifyOtp(data),
    });
}

export function createForgetPasswordResetPasswordQueryOptions() {
    return mutationOptions<
        HttpResponse<{}>,
        Error,
        ForgetPasswordPasswordResetRequest
    >({
        mutationFn: (data) => forgetPasswordResetPassword(data),
    });
}

export function createLogoutQueryOptions() {
    return mutationOptions<HttpResponse<{}>, Error, void>({
        mutationFn: () => logOutUser(),
    });
}

export function createGoogleLoginQueryOptions() {
    return mutationOptions<
        HttpResponse<loginResponse>,
        Error,
        GoogleLoginRequest
    >({
        mutationFn: (data) => googleLogin(data),
    });
}
