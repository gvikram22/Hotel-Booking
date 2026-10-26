
import multer from "multer";
import path from "path";
import os from "os";

const storage = multer.diskStorage({
  destination: os.tmpdir(),
  filename: (req, file, callback) => {
    callback(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per image
    files: 4,
  },
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
    } else {
      callback(new Error("Only image files are allowed"));
    }
  },
});

export default upload;
