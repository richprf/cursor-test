import { existsSync, mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { Request } from 'express';
import type { Options } from 'multer';
import { diskStorage } from 'multer';
import type { PublicUser } from '../users/users.service';

export const SHOPS_UPLOAD_DIR = join(process.cwd(), 'uploads', 'shops');
export const LOGO_URL_PREFIX = '/uploads/shops';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

export function ensureShopUploadDir(): void {
  if (!existsSync(SHOPS_UPLOAD_DIR)) {
    mkdirSync(SHOPS_UPLOAD_DIR, { recursive: true });
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

export const logoUploadOptions: Options = {
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      ensureShopUploadDir();
      cb(null, SHOPS_UPLOAD_DIR);
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

export function publicLogoUrl(filename: string): string {
  return `${LOGO_URL_PREFIX}/${filename}`;
}
