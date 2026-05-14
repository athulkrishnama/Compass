import { destinationModel } from "@infrastructure/repository/destination/destinationModel";
import { ICabDocument } from "@infrastructure/repository/cab/cabSchema";
import { IDestinationDocument } from "@infrastructure/repository/destination/destinationSchema";
import { IHotelBookingDocument } from "@infrastructure/repository/hotelBooking/hotelBookingSchema";
import { IHotelDocument } from "@infrastructure/repository/hotel/hotelSchema";
import { IRoomLockDocument } from "@infrastructure/repository/roomLock/roomLockSchema";
import { IRoomVariantDocument } from "@infrastructure/repository/roomVariant/roomVariantSchema";
import { IUserDocument } from "@infrastructure/repository/users/userSchema";
import { Model } from "mongoose";
import { container } from "tsyringe";
import { userModel } from "@infrastructure/repository/users/userModel";
import { cabModel } from "@infrastructure/repository/cab/cabModel";
import { hotelModel } from "@infrastructure/repository/hotel/hotelModel";
import { roomVariantModel } from "@infrastructure/repository/roomVariant/roomVariantModel";
import { hotelBookingModel } from "@infrastructure/repository/hotelBooking/hotelBookingModel";
import { roomLockModel } from "@infrastructure/repository/roomLock/roomLockModel";
import { IRoomStatusDocument } from "@infrastructure/repository/roomStatus/roomStatusSchema";
import { roomStatusModel } from "@infrastructure/repository/roomStatus/roomStatusModel";

import { IWalletDocument } from "@infrastructure/repository/wallet/walletSchema";
import { walletModel } from "@infrastructure/repository/wallet/walletModel";
import { ITransactionDocument } from "@infrastructure/repository/transaction/transactionSchema";
import { transactionModel } from "@infrastructure/repository/transaction/transactionModel";
import { IFareDocument } from "@infrastructure/repository/fare/fare.schema";
import { IRideDocument } from "@infrastructure/repository/ride/ride.schema";
import { fareModel } from "@infrastructure/repository/fare/fareModel";
import { rideModel } from "@infrastructure/repository/ride/rideModel";
import { INotificationDocument } from "@infrastructure/repository/notification/notification.schema";
import { notificationModel } from "@infrastructure/repository/notification/notificationModel";

export function registerModel() {
  container.register<Model<IUserDocument>>("IUserModel", {
    useValue: userModel,
  });
  container.register<Model<ICabDocument>>("ICabModel", {
    useValue: cabModel,
  });
  container.register<Model<IDestinationDocument>>("IDestinationModel", {
    useValue: destinationModel,
  });
  container.register<Model<IHotelDocument>>("IHotelModel", {
    useValue: hotelModel,
  });
  container.register<Model<IRoomVariantDocument>>("IRoomVariantModel", {
    useValue: roomVariantModel,
  });
  container.register<Model<IHotelBookingDocument>>("IHotelBookingModel", {
    useValue: hotelBookingModel,
  });
  container.register<Model<IRoomLockDocument>>("IRoomLockModel", {
    useValue: roomLockModel,
  });
  container.register<Model<IRoomStatusDocument>>("IRoomStatusModel", {
    useValue: roomStatusModel,
  });
  container.register<Model<IWalletDocument>>("IWalletModel", {
    useValue: walletModel,
  });
  container.register<Model<ITransactionDocument>>("ITransactionModel", {
    useValue: transactionModel,
  });
  container.register<Model<IFareDocument>>("IFareModel", {
    useValue: fareModel,
  });
  container.register<Model<IRideDocument>>("IRideModel", {
    useValue: rideModel,
  });
  container.register<Model<INotificationDocument>>("INotificationModel", {
    useValue: notificationModel,
  });
}
