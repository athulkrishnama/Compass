import {
    userLogin,
    userResendOtp,
    userSignupSendOTP,
    userVerifyOtp,
} from "@/services/api/authApiService";
import {
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
        mutationFn: (data) => userResendOtp(data)
    })
}

export function createLoginQueryOption(){
    return mutationOptions<HttpResponse<loginResponse>, Error, loginRequest>({
        mutationFn: (data) => userLogin(data)
    })
}