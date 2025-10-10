import { userModel } from "@infrastructure/repository/database configs/models/userModel";
import { IUserDocument } from "@infrastructure/repository/database configs/schemas/userSchema";
import { Model } from "mongoose";
import { container } from "tsyringe";

export function registerModel() {
  container.register<Model<IUserDocument>>("IUserModel", {
    useValue: userModel,
  });
}
