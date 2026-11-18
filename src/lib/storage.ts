import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Memastikan direktori public/uploads ada
 */
async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Menyimpan file yang diupload ke public/uploads/
 */
export async function saveFile(file: File): Promise<{ path: string; filename: string }> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("Format file tidak didukung. Harap upload format JPG, PNG, atau WebP.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Ukuran file terlalu besar. Maksimal 2MB.");
  }

  await ensureUploadDir();

  // Ekstensi aman
  const ext = file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg";
  const uniqueName = `${crypto.randomUUID()}${ext}`;
  const filePath = path.join(UPLOAD_DIR, uniqueName);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await fs.writeFile(filePath, buffer);

  return {
    path: `/uploads/${uniqueName}`,
    filename: uniqueName,
  };
}

/**
 * Menghapus file lokal jika ada
 */
export async function deleteFile(relativePublicPath: string): Promise<boolean> {
  try {
    if (!relativePublicPath.startsWith("/uploads/")) {
      return false; // Jangan hapus file di luar uploads/
    }
    const filename = path.basename(relativePublicPath);
    const filePath = path.join(UPLOAD_DIR, filename);
    await fs.unlink(filePath);
    return true;
  } catch {
    return false;
  }
}

