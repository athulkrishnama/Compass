import { IStorageService } from "@application/interfaces/service/storageService.interface";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@config/envConfig";
import { Errors } from "@infrastructure/Errors";
import { fileToBuffer } from "@presentation/utils/Fileconverter";
import { injectable } from "tsyringe";

@injectable()
export class StorageService implements IStorageService {
  private _client: S3Client;
  constructor() {
    this._client = new S3Client({
      region: env.S3_REGION,
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY,
      },
    });
  }

  async upload(file: File, key: string): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
        Body: await fileToBuffer(file),
      });

      await this._client.send(command);
      return key;
    } catch {
      throw new Error(Errors.UPLOAD_ERROR);
    }
  }

  async createSignedUrl(key: string, expiary: number): Promise<string> {
    const command = new GetObjectCommand({
      Key: key,
      Bucket: env.S3_BUCKET_NAME,
    });

    const signedUrl = await getSignedUrl(this._client, command, {
      expiresIn: expiary,
    });

    return signedUrl;
  }
}
