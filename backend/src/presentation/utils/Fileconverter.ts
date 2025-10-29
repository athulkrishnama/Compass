import { Errors } from "@infrastructure/Errors";

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
    throw new Error(Errors.CONVERSION_ERROR);
  }
}
