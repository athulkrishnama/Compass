import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";

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
