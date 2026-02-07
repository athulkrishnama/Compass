import { cabModel } from "@infrastructure/repository/database configs/models/cabModel";
import { destinationModel } from "@infrastructure/repository/database configs/models/destinationModel";
import { hotelBookingModel } from "@infrastructure/repository/database configs/models/hotelBookingModel";
import { hotelModel } from "@infrastructure/repository/database configs/models/hotelModel";
import { roomModel } from "@infrastructure/repository/database configs/models/roomModel";
import { roomVariantModel } from "@infrastructure/repository/database configs/models/roomVariantModel";
import { userModel } from "@infrastructure/repository/database configs/models/userModel";
import { ICabDocument } from "@infrastructure/repository/database configs/schemas/cabSchema";
import { IDestinationDocument } from "@infrastructure/repository/database configs/schemas/destinationSchema";
import { IHotelBookingDocument } from "@infrastructure/repository/database configs/schemas/hotelBookingSchema";
import { IHotelDocument } from "@infrastructure/repository/database configs/schemas/hotelSchema";
import { IRoomDocument } from "@infrastructure/repository/database configs/schemas/roomSchema";
import { IRoomLockDocument } from "@infrastructure/repository/database configs/schemas/roomLockSchema";
import { IRoomVariantDocument } from "@infrastructure/repository/database configs/schemas/roomVariantSchema";
import { IUserDocument } from "@infrastructure/repository/database configs/schemas/userSchema";
import { Model } from "mongoose";
import { container } from "tsyringe";
import { roomLockModel } from "@infrastructure/repository/database configs/models/roomLockModel";

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
  container.register<Model<IRoomDocument>>("IRoomModel", {
    useValue: roomModel,
  });
  container.register<Model<IHotelBookingDocument>>("IHotelBookingModel", {
    useValue: hotelBookingModel,
  });
  container.register<Model<IRoomLockDocument>>("IRoomLockModel", {
    useValue: roomLockModel,
  });
}
