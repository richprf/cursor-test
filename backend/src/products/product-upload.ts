import { existsSync, mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { Request } from 'express';
import type { Options } from 'multer';
import { diskStorage } from 'multer';
import type { PublicUser } from '../users/users.service';

export const PRODUCTS_UPLOAD_DIR = join(process.cwd(), 'uploads', 'products');
export const PRODUCT_IMAGE_URL_PREFIX = '/uploads/products';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

export function ensureProductUploadDir(): void {
  if (!existsSync(PRODUCTS_UPLOAD_DIR)) {
    mkdirSync(PRODUCTS_UPLOAD_DIR, { recursive: true });
  }
}

function extensionFor(file: Express.Multer.File): string {
  const fromName = extname(file.originalname || '').toLowerCase();
  if (ALLOWED_EXT.has(fromName)) return fromName === '.jpeg' ? '.jpg' : fromName;
  if (file.mimetype === 'image/png') return '.png';
  if (file.mimetype === 'image/webp') return '.webp';
  if (file.mimetype === 'image/gif') return '.gif';
  return '.jpg';
}

export const productImageUploadOptions: Options = {
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      ensureProductUploadDir();
      cb(null, PRODUCTS_UPLOAD_DIR);
    },
    filename: (req: Request & { user?: PublicUser }, file, cb) => {
      const userId = req.user?.id ?? randomUUID();
      cb(null, `${userId}-${randomUUID()}${extensionFor(file)}`);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, ALLOWED_MIME.has(file.mimetype));
  },
};

export function publicProductImageUrl(filename: string): string {
  return `${PRODUCT_IMAGE_URL_PREFIX}/${filename}`;
}
