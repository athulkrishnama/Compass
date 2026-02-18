import { IGetUsersUseCase } from "application/interfaces/useCase/admin/getUsersUseCase.interface";
import { IUserStatusChangeUseCase } from "application/interfaces/useCase/admin/userStatusChangeUseCase.interface";
import { IForgetPasswordResetPasswordUseCase } from "application/interfaces/useCase/auth/forgetPasswordResetPassword.interface";
import { IForgetPasswordSendOtpUseCase } from "application/interfaces/useCase/auth/forgetPasswordSendOtpUseCase.interface";
import { IForgetPasswordVerifyOtpUseCase } from "application/interfaces/useCase/auth/forgetPasswordVerifyOtpUseCase.interface";
import { ILoginUseCase } from "application/interfaces/useCase/auth/loginUseCase.interface";
import { IRefreshTokenUseCase } from "application/interfaces/useCase/auth/refreshTokenUseCase.interface";
import { ISignupResendOtpUsecase } from "application/interfaces/useCase/auth/signupResendOtpUseCase.interface";
import { ISignupUseCase } from "application/interfaces/useCase/auth/signupUseCase.interface";
import { ITokenInvalidationUseCase } from "application/interfaces/useCase/auth/tokenInvalidationUseCase.interface";
import { IVerifyOtpUseCase } from "application/interfaces/useCase/auth/verifyOtpUseCase.interface";
import { GetUsersUseCase } from "@useCases/admin/getUsersUseCase";
import { UserStatusChangeUseCase } from "@useCases/admin/userStatusChangeUseCase";
import { ForgetPasswordResetPasswordUseCase } from "@useCases/auth/forgetPasswordResetPasswordUseCase";
import { ForgetPasswordSendOtpUseCase } from "@useCases/auth/forgetPasswordSendOtpUseCase";
import { ForgetPasswordVerifyOtpUseCase } from "@useCases/auth/forgetPasswordVerifyOtpUseCase";
import { LoginUseCase } from "@useCases/auth/loginUseCase";
import { RefreshTokenUseCase } from "@useCases/auth/refreshTokenUseCase";
import { SignupResendOtpUseCase } from "@useCases/auth/signupResendOtpUseCase";
import { SignupUseCase } from "@useCases/auth/signupUseCase";
import { SignupVerifyOtpUseCase } from "@useCases/auth/signupVerifyOtpUseCase";
import { TokenInvalidationUseCase } from "@useCases/auth/tokenInvalidationUseCase";
import { container } from "tsyringe";
import { IGoogleLoginUseCase } from "@application/interfaces/useCase/auth/googleLoginUseCase.interface";
import { GoogleLoginUseCase } from "@useCases/auth/googleLoginUseCase";
import { IGetUserProfileUseCase } from "@application/interfaces/useCase/auth/getUserProfileUseCase.interface";
import { GetUserProfileUseCase } from "@useCases/auth/getUserProfileUseCase";
import { IUpdateUserProfileUseCase } from "@application/interfaces/useCase/auth/updateUserProfileUseCase.interface";
import { UpdateUserProfileUseCase } from "@useCases/auth/updateUserProfileUseCase";
import { IGetUnverifiedUsersUseCase } from "@application/interfaces/useCase/admin/getUnverifiedUserUseCase.interface";
import { GetUnverifiedUsersUseCase } from "@useCases/admin/getUnverifiedUsersUseCase";
import { GetUnverifiedUserDetailsUseCase } from "@useCases/admin/getUnverifiedUserDetailsUseCase";
import { IGetUnverifiedUserDetailsUseCase } from "@application/interfaces/useCase/admin/getUnverifiedUserDetailsUseCase.interface";
import { IApproveUserVerificationRequestUseCase } from "@application/interfaces/useCase/admin/approveUserVerificationRequestUseCase.interface";
import { ApproveUserVerificationRequestUseCase } from "@useCases/admin/approveUserVerificationRequestUseCase";
import { IRejectUserVerificationRequestUseCase } from "@application/interfaces/useCase/admin/rejectUserVerificationRequestUseCase.interface";
import { RejectUserVerificationRequestUseCase } from "@useCases/admin/rejectUserVerificationRequestUseCase";
import { IChangePasswordUseCase } from "@application/interfaces/useCase/auth/changePasswordUseCase.interface";
import { ChangePasswordUseCase } from "@useCases/auth/changePasswordUseCase";
import { IUpdateVehicleUseCase } from "@application/interfaces/useCase/cab/updateVehicleUseCase.interface";
import { UpdateVehicleUseCase } from "@useCases/cab/updateVehicleUseCase";
import { IGetCabDetailsUseCase } from "@application/interfaces/useCase/cab/getCabDetailsUseCase.interface";
import { GetCabDetailsUseCase } from "@useCases/cab/getCabDetailsUseCase";
import { IDeleteCabImageUseCase } from "@application/interfaces/useCase/cab/deleteCabImageUseCase.interface";
import { DeleteCabImageUseCase } from "@useCases/cab/deleteCabImageUseCase";
import { IChangeEmailNewEmailUseCase } from "@application/interfaces/useCase/auth/changeEmailNewEmailUseCase.interface";
import { ChangeEmailNewEmailUseCase } from "@useCases/auth/changeEmailNewEmailUseCase";
import { IChangeEmailRequestOtpUseCase } from "@application/interfaces/useCase/auth/changeEmailRequestOtpUseCase.interface";
import { ChangeEmailRequestOtpUseCase } from "@useCases/auth/changeEmailRequestOtpUseCase";
import { IChangeEmailVerifyOtpUseCase } from "@application/interfaces/useCase/auth/changeEmailVerifyOtpUseCase.interface";
import { ChangeEmailVerifyOtpUseCase } from "@useCases/auth/changeEmailVerifyOtpUseCase";
import { ICreateDestinationUseCase } from "@application/interfaces/useCase/admin/createDestinationUseCase.interface";
import { CreateDestinationUseCase } from "@useCases/admin/createDestinationUseCase";
import { IListDestinationsUseCase } from "@application/interfaces/useCase/admin/ListDestinationsUseCase.interface";
import { ListDestinationsUseCase } from "@useCases/admin/listDestinationsUseCase";
import { IUpdateDestinationUseCase } from "@application/interfaces/useCase/admin/updateDestinationUseCase.interface";
import { UpdateDestinationUseCase } from "@useCases/admin/updateDestinationUseCase";
import { IFindDestinationByIdUseCase } from "@application/interfaces/useCase/admin/findDestinationByIdUseCase.interface";
import { FindDestinationByIdUseCase } from "@useCases/admin/findDestinationByIdUseCase";
import { IDeleteDestinationImageUseCase } from "@application/interfaces/useCase/admin/deleteDestinationImageUseCase.interface";
import { DelteDestinationImageUseCase } from "@useCases/admin/deleteDestinationImageUseCase";
import { CreateHotelUseCase } from "@useCases/hotel/createHotelUseCase";
import { ICreateHotelUseCase } from "@application/interfaces/useCase/hotel/createHotelUseCase.interface";
import { IGetHotelsByUserIdUseCase } from "@application/interfaces/useCase/hotel/getHotelsByUserIdUseCase.interface";
import { GetHotelsByUserIdUseCase } from "@useCases/hotel/getHotelsByUserIdUseCase";
import { IEditHotelUseCase } from "@application/interfaces/useCase/hotel/editHotelUseCase.interface";
import { EditHotelUseCase } from "@useCases/hotel/editHotelUseCase";
import { IGetHotelByIdUseCase } from "@application/interfaces/useCase/hotel/getHotelByIdUseCase.interface";
import { GetHotelByIdUseCase } from "@useCases/hotel/getHoteByIdUseCase";
import { IDeleteHotelImageUseCase } from "@application/interfaces/useCase/hotel/deleteHotelImageUseCase.interface";
import { DeleteHotelImageUseCase } from "@useCases/hotel/deleteHotelImageUseCase";
import { ICreateRoomVariantUseCase } from "@application/interfaces/useCase/roomVariant/createRoomVariantUseCase.interface";
import { CreateRoomVariantUseCase } from "@useCases/roomVariant/createRoomVariantUseCase";
import { IListRoomVariantsByHotelIdUseCase } from "@application/interfaces/useCase/roomVariant/listRoomVariantsByHotelIdUseCase.interface";
import { ListRoomVariantsByHotelIdUseCase } from "@useCases/roomVariant/listRoomVariantsByHotelIdUseCase";
import { IEditRoomVariantUseCase } from "@application/interfaces/useCase/roomVariant/editRoomVariantUseCase.interface";
import { EditRoomVariantUseCase } from "@useCases/roomVariant/editRoomVariantUseCase";
import { IGetRoomVariantByIdUseCase } from "@application/interfaces/useCase/roomVariant/getRoomVariantByIdUseCase.interface";
import { GetRoomVariantByIdUseCase } from "@useCases/roomVariant/getRoomVariantByIdUseCase";
import { IDeleteRoomVariantImageUseCase } from "@application/interfaces/useCase/roomVariant/deleteRoomVariantImageUseCase.interface";
import { DeleteRoomVariantImageUseCase } from "@useCases/roomVariant/deleteRoomVariantImageUseCase";
import { IGetDestinationUseCase } from "@application/interfaces/useCase/destination/getDestinationUseCase.interface";
import { GetDestinationUseCase } from "@useCases/destination/getDestinationUseCase";
import { IHotelSearchUseCase } from "@application/interfaces/useCase/hotel/hotelSearchUseCase.interface";
import { HotelSearchUseCase } from "@useCases/hotel/hotelSearchUseCase";
import { IGetRoomAvailabilityUseCase } from "@application/interfaces/useCase/roomVariant/getRoomAvailabilityUseCase.interface";
import { GetRoomAvailabilityUseCase } from "@useCases/roomVariant/getRoomAvailabilityUseCase";
import { ICreatePaymentIntentUseCase } from "@application/interfaces/useCase/payment/createPaymentIntentUseCase.interface";
import { CreatePaymentIntentUseCase } from "@useCases/payment/createPaymentIntentUseCase";
import { IVerifyPaymentUseCase } from "@application/interfaces/useCase/payment/verifyPaymentUseCase.interface";
import { VerifyPaymentUseCase } from "@useCases/payment/verifyPaymentUseCase";
import { IMarkRoomAsUnavailableUseCase } from "@application/interfaces/useCase/roomVariant/markRoomAsUnavailableUseCase.interface";
import { MarkRoomAsUnavailableUseCase } from "@useCases/roomVariant/markRoomAsUnavailableUseCase";
import { IUpdateRoomUnavailabilityUseCase } from "@application/interfaces/useCase/roomVariant/updateRoomUnavailabilityUseCase.interface";
import { UpdateRoomUnavailabilityUseCase } from "@useCases/roomVariant/updateRoomUnavailabilityUseCase";
import { IRestoreRoomUseCase } from "@application/interfaces/useCase/roomVariant/restoreRoomUseCase.interface";
import { RestoreRoomUseCase } from "@useCases/roomVariant/restoreRoomUseCase";
import { IGetBookingByPaymentIdUseCase } from "@application/interfaces/useCase/hotelBooking/IGetBookingByPaymentIdUseCase";
import { GetBookingByPaymentIdUseCase } from "@useCases/hotelBooking/GetBookingByPaymentIdUseCase";
import { IGetTravelerUpcomingBookingsUseCase } from "@application/interfaces/useCase/hotelBooking/IGetTravelerUpcomingBookingsUseCase";
import { GetTravelerUpcomingBookingsUseCase } from "@useCases/hotelBooking/GetTravelerUpcomingBookingsUseCase";
import { IGetTravelerCompletedBookingsUseCase } from "@application/interfaces/useCase/hotelBooking/IGetTravelerCompletedBookingsUseCase";
import { IGetTravelerOngoingBookingsUseCase } from "@application/interfaces/useCase/hotelBooking/IGetTravelerOngoingBookingsUseCase";
import { GetTravelerCompletedBookingsUseCase } from "@useCases/hotelBooking/GetTravelerCompletedBookingsUseCase";
import { GetTravelerOngoingBookingsUseCase } from "@useCases/hotelBooking/GetTravelerOngoingBookingsUseCase";
import { IGetBookingDetailsUseCase } from "@application/interfaces/useCase/hotelBooking/IGetBookingDetailsUseCase";
import { GetBookingDetailsUseCase } from "@useCases/hotelBooking/GetBookingDetailsUseCase";
import { ICancelBookingUseCase } from "@application/interfaces/useCase/hotelBooking/ICancelBookingUseCase";
import { CancelBookingUseCase } from "@useCases/hotelBooking/CancelBookingUseCase";
import { IGetOverallDashboardUseCase } from "@application/interfaces/useCase/hotelBooking/IGetOverallDashboardUseCase";
import { GetOverallDashboardUseCase } from "@useCases/hotelBooking/GetOverallDashboardUseCase";
import { IGetHotelDashboardUseCase } from "@application/interfaces/useCase/hotelBooking/IGetHotelDashboardUseCase";
import { GetHotelDashboardUseCase } from "@useCases/hotelBooking/GetHotelDashboardUseCase";
import { IGetHotelBookingsUseCase } from "@application/interfaces/useCase/hotelBooking/IGetHotelBookingsUseCase";
import { GetHotelBookingsUseCase } from "@useCases/hotelBooking/GetHotelBookingsUseCase";

export function registerUsecases() {
  container.registerSingleton<ISignupUseCase>("ISignupUseCase", SignupUseCase);
  container.registerSingleton<IVerifyOtpUseCase>(
    "IVerifyOtpUseCase",
    SignupVerifyOtpUseCase,
  );
  container.registerSingleton<ISignupResendOtpUsecase>(
    "ISignupResendOtpUsecase",
    SignupResendOtpUseCase,
  );
  container.registerSingleton<ILoginUseCase>("ILoginUseCase", LoginUseCase);
  container.registerSingleton<IForgetPasswordSendOtpUseCase>(
    "IForgetPasswordSendOtpUseCase",
    ForgetPasswordSendOtpUseCase,
  );
  container.registerSingleton<IForgetPasswordVerifyOtpUseCase>(
    "IForgetPasswordVerifyOtpUseCase",
    ForgetPasswordVerifyOtpUseCase,
  );
  container.registerSingleton<IForgetPasswordResetPasswordUseCase>(
    "IForgetPasswordResetPasswordUseCase",
    ForgetPasswordResetPasswordUseCase,
  );
  container.registerSingleton<IRefreshTokenUseCase>(
    "IRefreshTokenUseCase",
    RefreshTokenUseCase,
  );
  container.registerSingleton<IGetUsersUseCase>(
    "IGetUsersUseCase",
    GetUsersUseCase,
  );
  container.registerSingleton<IUserStatusChangeUseCase>(
    "IUserStatusChangeUseCase",
    UserStatusChangeUseCase,
  );
  container.registerSingleton<ITokenInvalidationUseCase>(
    "ITokenInvalidationUseCase",
    TokenInvalidationUseCase,
  );
  container.registerSingleton<IGoogleLoginUseCase>(
    "IGoogleLoginUseCase",
    GoogleLoginUseCase,
  );
  container.registerSingleton<IGetUserProfileUseCase>(
    "IGetUserProfileUseCase",
    GetUserProfileUseCase,
  );
  container.registerSingleton<IUpdateUserProfileUseCase>(
    "IUpdateUserProfileUseCase",
    UpdateUserProfileUseCase,
  );
  container.registerSingleton<IGetUnverifiedUsersUseCase>(
    "IGetUnverifiedUsersUseCase",
    GetUnverifiedUsersUseCase,
  );
  container.registerSingleton<IGetUnverifiedUserDetailsUseCase>(
    "IGetUnverifiedUserDetailsUseCase",
    GetUnverifiedUserDetailsUseCase,
  );
  container.registerSingleton<IApproveUserVerificationRequestUseCase>(
    "IApproveUserVerificationRequestUseCase",
    ApproveUserVerificationRequestUseCase,
  );
  container.registerSingleton<IRejectUserVerificationRequestUseCase>(
    "IRejectUserVerificationRequestUseCase",
    RejectUserVerificationRequestUseCase,
  );
  container.registerSingleton<IChangePasswordUseCase>(
    "IChangePasswordUseCase",
    ChangePasswordUseCase,
  );
  container.registerSingleton<IUpdateVehicleUseCase>(
    "IUpdateVehicleUseCase",
    UpdateVehicleUseCase,
  );
  container.registerSingleton<IGetCabDetailsUseCase>(
    "IGetCabDetailsUseCase",
    GetCabDetailsUseCase,
  );
  container.registerSingleton<IDeleteCabImageUseCase>(
    "IDeleteCabImageUseCase",
    DeleteCabImageUseCase,
  );
  container.registerSingleton<IChangeEmailNewEmailUseCase>(
    "IChangeEmailNewEmailUseCase",
    ChangeEmailNewEmailUseCase,
  );
  container.registerSingleton<IChangeEmailRequestOtpUseCase>(
    "IChangeEmailRequestOtpUseCase",
    ChangeEmailRequestOtpUseCase,
  );
  container.registerSingleton<IChangeEmailVerifyOtpUseCase>(
    "IChangeEmailVerifyOtpUseCase",
    ChangeEmailVerifyOtpUseCase,
  );
  container.registerSingleton<ICreateDestinationUseCase>(
    "ICreateDestinationUseCase",
    CreateDestinationUseCase,
  );
  container.registerSingleton<IListDestinationsUseCase>(
    "IListDestinationsUseCase",
    ListDestinationsUseCase,
  );
  container.registerSingleton<IUpdateDestinationUseCase>(
    "IUpdateDestinationUseCase",
    UpdateDestinationUseCase,
  );
  container.registerSingleton<IFindDestinationByIdUseCase>(
    "IFindDestinationByIdUseCase",
    FindDestinationByIdUseCase,
  );
  container.registerSingleton<IDeleteDestinationImageUseCase>(
    "IDeleteDestinationImageUseCase",
    DelteDestinationImageUseCase,
  );
  container.registerSingleton<ICreateHotelUseCase>(
    "ICreateHotelUseCase",
    CreateHotelUseCase,
  );
  container.registerSingleton<IGetHotelsByUserIdUseCase>(
    "IGetHotelsByUserIdUseCase",
    GetHotelsByUserIdUseCase,
  );
  container.registerSingleton<IEditHotelUseCase>(
    "IEditHotelUseCase",
    EditHotelUseCase,
  );
  container.registerSingleton<IGetHotelByIdUseCase>(
    "IGetHotelByIdUseCase",
    GetHotelByIdUseCase,
  );
  container.registerSingleton<IDeleteHotelImageUseCase>(
    "IDeleteHotelImageUseCase",
    DeleteHotelImageUseCase,
  );
  container.registerSingleton<ICreateRoomVariantUseCase>(
    "ICreateRoomVariantUseCase",
    CreateRoomVariantUseCase,
  );
  container.registerSingleton<IListRoomVariantsByHotelIdUseCase>(
    "IListRoomVariantsByHotelIdUseCase",
    ListRoomVariantsByHotelIdUseCase,
  );
  container.registerSingleton<IEditRoomVariantUseCase>(
    "IEditRoomVariantUseCase",
    EditRoomVariantUseCase,
  );
  container.registerSingleton<IGetRoomVariantByIdUseCase>(
    "IGetRoomVariantByIdUseCase",
    GetRoomVariantByIdUseCase,
  );
  container.registerSingleton<IDeleteRoomVariantImageUseCase>(
    "IDeleteRoomVariantImageUseCase",
    DeleteRoomVariantImageUseCase,
  );
  container.registerSingleton<IGetDestinationUseCase>(
    "IGetDestinationUseCase",
    GetDestinationUseCase,
  );
  container.registerSingleton<IHotelSearchUseCase>(
    "IHotelSearchUseCase",
    HotelSearchUseCase,
  );
  container.registerSingleton<IGetRoomAvailabilityUseCase>(
    "IGetRoomAvailabilityUseCase",
    GetRoomAvailabilityUseCase,
  );
  container.registerSingleton<ICreatePaymentIntentUseCase>(
    "ICreatePaymentIntentUseCase",
    CreatePaymentIntentUseCase,
  );
  container.registerSingleton<IVerifyPaymentUseCase>(
    "IVerifyPaymentUseCase",
    VerifyPaymentUseCase,
  );
  container.registerSingleton<IMarkRoomAsUnavailableUseCase>(
    "IMarkRoomAsUnavailableUseCase",
    MarkRoomAsUnavailableUseCase,
  );
  container.registerSingleton<IUpdateRoomUnavailabilityUseCase>(
    "IUpdateRoomUnavailabilityUseCase",
    UpdateRoomUnavailabilityUseCase,
  );
  container.registerSingleton<IRestoreRoomUseCase>(
    "IRestoreRoomUseCase",
    RestoreRoomUseCase,
  );
  container.registerSingleton<IGetBookingByPaymentIdUseCase>(
    "IGetBookingByPaymentIdUseCase",
    GetBookingByPaymentIdUseCase,
  );
  container.registerSingleton<IGetTravelerUpcomingBookingsUseCase>(
    "IGetTravelerUpcomingBookingsUseCase",
    GetTravelerUpcomingBookingsUseCase,
  );

  container.registerSingleton<IGetTravelerOngoingBookingsUseCase>(
    "IGetTravelerOngoingBookingsUseCase",
    GetTravelerOngoingBookingsUseCase,
  );

  container.registerSingleton<IGetTravelerCompletedBookingsUseCase>(
    "IGetTravelerCompletedBookingsUseCase",
    GetTravelerCompletedBookingsUseCase,
  );
  container.registerSingleton<IGetBookingDetailsUseCase>(
    "IGetBookingDetailsUseCase",
    GetBookingDetailsUseCase,
  );
  container.registerSingleton<ICancelBookingUseCase>(
    "ICancelBookingUseCase",
    CancelBookingUseCase,
  );
  container.registerSingleton<IGetOverallDashboardUseCase>(
    "IGetOverallDashboardUseCase",
    GetOverallDashboardUseCase,
  );
  container.registerSingleton<IGetHotelDashboardUseCase>(
    "IGetHotelDashboardUseCase",
    GetHotelDashboardUseCase,
  );
  container.registerSingleton<IGetHotelBookingsUseCase>(
    "IGetHotelBookingsUseCase",
    GetHotelBookingsUseCase,
  );
}
