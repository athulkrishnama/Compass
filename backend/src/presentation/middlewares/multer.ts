import multer, { memoryStorage } from "multer";

export const uploadMiddleware = multer({
  storage: memoryStorage(),
});
