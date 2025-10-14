import type { ROLE } from "@/types/role";

export interface signupRequest {
    full_name: string;
    email: string;
    password: string;
    role: ROLE;
}

export interface OtpVerifyRequest {
    email: string;
    otp: string;
}

export interface loginRequest {
    email: string;
    password: string;
}

export interface ForgetPasswordVerifyOtpRequest {
    email: string;
    otp: string;
}

export interface ForgetPasswordPasswordResetRequest {
    email: string;
    password: string;
    token: string;
}

export interface GoogleLoginRequest {
    authorizationCode: string;
    role: ROLE;
}
