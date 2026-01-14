import { cabModel } from "@infrastructure/repository/database configs/models/cabModel";
import { destinationModel } from "@infrastructure/repository/database configs/models/destinationModel";
import { hotelModel } from "@infrastructure/repository/database configs/models/hotelModel";
import { userModel } from "@infrastructure/repository/database configs/models/userModel";
import { ICabDocument } from "@infrastructure/repository/database configs/schemas/cabSchema";
import { IDestinationDocument } from "@infrastructure/repository/database configs/schemas/destinationSchema";
import { IHotelDocument } from "@infrastructure/repository/database configs/schemas/hotelSchema";
import { IUserDocument } from "@infrastructure/repository/database configs/schemas/userSchema";
import { Model } from "mongoose";
import { container } from "tsyringe";

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
}
