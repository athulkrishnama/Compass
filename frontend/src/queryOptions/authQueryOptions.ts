import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import {
    changePassword,
    forgetPasswordResetPassword,
    forgetPasswordSendOtp,
    forgetPasswordVerifyOtp,
    getUserProfile,
    googleLogin,
    logOutUser,
    updateUserProfile,
    userLogin,
    userResendOtp,
    userSignupSendOTP,
    userVerifyOtp,
} from "@/services/api/authApiService";
import {
    type ChangePasswordRequest,
    type ForgetPasswordPasswordResetRequest,
    type ForgetPasswordVerifyOtpRequest,
    type GoogleLoginRequest,
    type loginRequest,
    type OtpVerifyRequest,
    type signupRequest,
} from "@/types/api/requests/authRequests";
import type { loginResponse } from "@/types/api/responses/loginReponse";
import type { IGetUserProfileResponse } from "@/types/api/responses/userResponses";
import type { HttpResponse } from "@/types/api/responseType";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export function createSignupQueryOptions() {
    return mutationOptions<HttpResponse<object>, Error, signupRequest>({
        mutationFn: (data) => userSignupSendOTP(data),
    });
}

export function createVerifySignupOtpQueryOptions() {
    return mutationOptions<HttpResponse<object>, Error, OtpVerifyRequest>({
        mutationFn: (data) => userVerifyOtp(data),
    });
}

export function createResendOtpQueryOptions() {
    return mutationOptions<HttpResponse<object>, Error, string>({
        mutationFn: (data) => userResendOtp(data),
    });
}

export function createLoginQueryOption() {
    return mutationOptions<HttpResponse<loginResponse>, Error, loginRequest>({
        mutationFn: (data) => userLogin(data),
    });
}

export function createForgetPasswordSendOtpQueryOptions() {
    return mutationOptions<HttpResponse<object>, Error, string>({
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
        HttpResponse<object>,
        Error,
        ForgetPasswordPasswordResetRequest
    >({
        mutationFn: (data) => forgetPasswordResetPassword(data),
    });
}

export function createLogoutQueryOptions() {
    return mutationOptions<HttpResponse<object>, Error, void>({
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

export function createGetUserProfileQueryOptions() {
    return queryOptions<HttpResponse<IGetUserProfileResponse>, Error>({
        queryKey: [QUERY_KEYS.USER_PROFILE],
        queryFn: getUserProfile,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
}

export function createUpdateUserProfileQueryOptions() {
    return mutationOptions<HttpResponse<object>, Error, FormData>({
        mutationFn: updateUserProfile,
    });
}

export function createChangePasswordMutationOptions() {
    return mutationOptions<HttpResponse<object>, Error, ChangePasswordRequest>({
        mutationFn: changePassword,
    });
}
