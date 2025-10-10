import rfs from "rotating-file-stream";
import path from "path";

type intervalType =
  | `${number}M`
  | `${number}d`
  | `${number}h`
  | `${number}m`
  | `${number}s`
  | undefined;

export const createRotatingFileStream = (
  interval: intervalType,
  maxFiles: number,
  filePath: string,
) => {
  return rfs.createStream(
    (time) => {
      if (!time) return path.join(filePath, "buffer.txt");
      return path.join(filePath, new Date().toDateString() + ".txt");
    },
    {
      interval,
      maxFiles,
    },
  );
};
