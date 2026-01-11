import { cabModel } from "@infrastructure/repository/database configs/models/cabModel";
import { destinationModel } from "@infrastructure/repository/database configs/models/destinationModel";
import { userModel } from "@infrastructure/repository/database configs/models/userModel";
import { ICabDocument } from "@infrastructure/repository/database configs/schemas/cabSchema";
import { IDestinationDocument } from "@infrastructure/repository/database configs/schemas/destination";
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
}
