import { IHashService } from "application/interfaces/service/hashService.interface";
import bcrypt from "bcrypt";
import { injectable } from "tsyringe";

@injectable()
export class HashService implements IHashService {
  async compare(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash);
  }

  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, 10);
  }
}
