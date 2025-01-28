import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ApiError } from "@/src/lib/errors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function prepareUploadAvatarForR2(file: File, userId: string) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new ApiError("Format de fichier non autorisé", 400);
  }

  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    throw new ApiError("Fichier trop volumineux (max 2 Mo)", 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const fileName = `${userId}-${Date.now()}.${file.type.split("/")[1]}`;

  return { fileName, buffer };
}
