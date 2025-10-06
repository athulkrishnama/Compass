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


export interface loginRequest{
    email: string,
    password: string,
}