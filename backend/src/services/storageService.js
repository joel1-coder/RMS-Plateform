const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { AppError } = require('../middlewares/errorHandler');

function uploadRoot() {
  return path.resolve(__dirname, '..', '..', process.env.UPLOAD_DIR || 'uploads');
}

function allowedExtensions() {
  return (process.env.ALLOWED_FILE_EXTENSIONS || '.pdf,.doc,.docx')
    .split(',')
    .map((ext) => ext.trim().toLowerCase())
    .filter(Boolean);
}

function maxFileSize() {
  const sizeMb = Number(process.env.MAX_FILE_SIZE_MB || 20);
  return sizeMb * 1024 * 1024;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

/**
 * Creates a configured Multer middleware for local file storage.
 * @param {object} options Options.
 * @param {string} options.subdir Upload subdirectory.
 * @returns {Function}
 */
function createUploadMiddleware({ subdir }) {
  const destination = path.join(uploadRoot(), subdir);
  ensureDir(destination);

  const storage = multer.diskStorage({
    destination,
    filename(req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]+/gi, '-').slice(0, 80);
      cb(null, `${Date.now()}_${base}${ext}`);
    }
  });

  return multer({
    storage,
    limits: { fileSize: maxFileSize() },
    fileFilter(req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowedExtensions().includes(ext)) {
        return cb(new AppError(`Unsupported file type ${ext}`, 400));
      }
      return cb(null, true);
    }
  });
}

/**
 * Converts a local Multer file into a public URL path.
 * @param {object} file Multer file.
 * @param {string} subdir Upload subdirectory.
 * @returns {string}
 */
function publicFileUrl(file, subdir) {
  return `/uploads/${subdir}/${file.filename}`;
}

/**
 * Placeholder for S3-compatible storage.
 *
 * Configure S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, and
 * S3_ENDPOINT before replacing the local upload implementation with a streaming
 * object-store adapter.
 */
async function uploadToS3() {
  throw new AppError('S3 storage adapter is not configured', 501);
}

module.exports = { createUploadMiddleware, publicFileUrl, uploadToS3, uploadRoot };
