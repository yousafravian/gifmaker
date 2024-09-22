import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isVideo(fileType: string): boolean {
  return fileType.startsWith("video/");
}

export function isAudio(fileType: string): boolean {
  return fileType.startsWith("audio/");
}

export function isImage(fileType: string): boolean {
  return fileType.startsWith("image/");
}
