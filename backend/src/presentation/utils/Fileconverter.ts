import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import sharp from "sharp";

export function mutlterFileToFileconverter(
  multerFile: Express.Multer.File,
): File {
  const file = new File(
    [new Uint8Array(multerFile.buffer)],
    multerFile.originalname,
    {
      type: multerFile.mimetype,
    },
  );

  return file;
}

export async function fileToBuffer(file: File): Promise<Buffer> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer;
  } catch {
    throw new Error(INTERNAL_ERROR_MESSAGES.CONVERSION_ERROR);
  }
}

export async function webpConverter(file: File): Promise<File> {
  try {
    const buffer = await fileToBuffer(file);
    const convertedFile = await sharp(buffer).webp().toBuffer();
    return new File([new Uint8Array(convertedFile)], file.name, {
      type: "image/webp",
    });
  } catch {
    throw new Error(INTERNAL_ERROR_MESSAGES.CONVERSION_ERROR);
  }
}

export async function fileResizer(file: File, width: number): Promise<File> {
  try {
    const buffer = await fileToBuffer(file);
    const resizedFile = await sharp(buffer).resize({ width }).toBuffer();
    return new File([new Uint8Array(resizedFile)], file.name, {
      type: file.type,
    });
  } catch {
    throw new Error(INTERNAL_ERROR_MESSAGES.CONVERSION_ERROR);
  }
}
