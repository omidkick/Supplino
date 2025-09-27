const multer = require("multer");
const path = require("path");
const fs = require("fs");
const createError = require("http-errors");

// ✅ Helper to create upload directory path for specific field
function createRoute(fieldName) {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  // Create separate directories for different field types
  const directory = path.join(
    __dirname,
    "..",
    "uploads",
    fieldName,
    year,
    month,
    day
  );

  // Ensure directory exists
  fs.mkdirSync(directory, { recursive: true });

  return directory;
}

// ✅ Multer disk storage config with separate handling for different fields
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!file?.originalname) return cb(null, null);

    // Create directory based on field name
    const filePath = createRoute(file.fieldname);
    cb(null, filePath);
  },

  filename: (req, file, cb) => {
    if (file.originalname) {
      const ext = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = String(uniqueSuffix + ext);

      // Create relative path for database storage
      const date = new Date();
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const relativePath = path
        .join("uploads", file.fieldname, year, month, day, fileName)
        .replace(/\\/g, "/");

      // Store paths in request body for different field types
      if (file.fieldname === "thumbnails") {
        if (!req.body.thumbnailPaths) req.body.thumbnailPaths = [];
        req.body.thumbnailPaths.push({
          filename: fileName,
          path: relativePath,
          originalName: file.originalname,
        });
      }

      if (file.fieldname === "coverImage") {
        req.body.coverImagePath = relativePath;
      }

      if (file.fieldname === "avatar") {
        req.body.fileUploadPath = path.join(
          "uploads",
          file.fieldname,
          year,
          month,
          day
        );
        req.body.filename = fileName;
        req.body.avatarPath = relativePath;
      }

      // NEW: Handle category image
      if (file.fieldname === "categoryImage") {
        req.body.imagePath = relativePath;
      }

      return cb(null, fileName);
    }
    cb(null, null);
  },
});

// ✅ Image filter
function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  if (allowed.includes(ext)) return cb(null, true);
  return cb(createError.BadRequest("فرمت ارسال شده تصویر صحیح نمیباشد"));
}

// ✅ Video/audio filters (unchanged)
function videoFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = [".mp4", ".mpg", ".mov", ".avi", ".mkv"];
  if (allowed.includes(ext)) return cb(null, true);
  return cb(createError.BadRequest("فرمت ارسال شده ویدیو صحیح نمیباشد"));
}

function videoOrAudioFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = [
    ".mp4",
    ".mpg",
    ".mov",
    ".avi",
    ".mkv",
    ".mp3",
    ".ogg",
    ".m4a",
    ".mp2",
    ".aifc",
    ".aiff",
    ".wav",
  ];
  if (allowed.includes(ext)) {
    req.body.fileType = file.mimetype.includes("audio") ? "audio" : "video";
    return cb(null, true);
  }
  return cb(createError.BadRequest("فرمت ارسال شده ویدیو یا صدا صحیح نمیباشد"));
}

function audioFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = [".mp3", ".ogg", ".m4a"];
  if (allowed.includes(ext)) return cb(null, true);
  return cb(createError.BadRequest("فرمت ارسال شده وویس صحیح نمیباشد"));
}

// ✅ File size limits
const avatarMaxSize = 2 * 1000 * 1000; // 2MB
const videoMaxSize = 200 * 1000 * 1000; // 200MB
const audioMaxSize = 20 * 1000 * 1000; // 20MB

// ✅ Single file for coverImage
const uploadFile = multer({
  storage,
  fileFilter,
  limits: { fileSize: avatarMaxSize },
});

// ✅ Multiple files for thumbnails
const uploadProductFiles = multer({
  storage,
  fileFilter,
  limits: { fileSize: avatarMaxSize },
});

// ✅ Audio and video (no change)
const uploadReviewFile = multer({
  storage,
  fileFilter: videoOrAudioFilter,
  limits: { fileSize: videoMaxSize },
});

const uploadAudio = multer({
  storage,
  fileFilter: audioFilter,
  limits: { fileSize: audioMaxSize },
});

module.exports = {
  uploadFile, // single file e.g. coverImage
  uploadProductFiles, // multiple files e.g. thumbnails[]
  uploadReviewFile, // for audio/video review uploads
  uploadAudio, // just audio uploads
};
