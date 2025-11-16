export interface IUserStatusChangeRequest {
    id: string;
    status: boolean;
}

export interface IRejectUserRegistrationRequest {
    reason: string;
}
