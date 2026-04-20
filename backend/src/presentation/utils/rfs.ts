import { createStream } from "rotating-file-stream";

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
  return createStream(
    (time: Date | number) => {
      if (!time) return "buffer.txt";
      const d = time instanceof Date ? time : new Date(time);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}.txt`;
    },
    {
      interval,
      maxFiles,
      path: filePath,
    },
  );
};
