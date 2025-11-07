import { Prisma } from "@/generated/prisma";
import { GenericResponse } from "@/types/shared/generic-response-type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ConvertToJSObject<T>(input: T): T {
  return JSON.parse(JSON.stringify(input));
}

export function FixedRound2(value: number): number {
  return Number((Math.round(value * 100) / 100).toFixed(2));
}

export function getErrorMessage(error: unknown): string {
  // 1️⃣ Handle Zod validation errors
  if (error instanceof ZodError) {
    // Collect field-level messages
    return error.issues
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
  }

  // 2️⃣ Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // For example: unique constraint or missing record
    switch (error.code) {
      case "P2002":
        return `Duplicate value error on field: ${(
          error.meta?.target as string[]
        )?.join(", ")}`;
      case "P2025":
        return "Record not found or already deleted.";
      default:
        return `Database error (code: ${error.code}).`;
    }
  }

  // 3️⃣ Handle Prisma initialization or validation errors
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return "Failed to connect to the database.";
  }
  if (error instanceof Prisma.PrismaClientValidationError) {
    return "Invalid data passed to the database operation.";
  }

  // 4️⃣ Handle generic Error objects
  if (error instanceof Error) {
    return error.message || "An unknown error occurred.";
  }

  // 5️⃣ Fallback for non-standard errors
  return "Unexpected error occurred.";
}

export function getErrorResponse<T>(error: unknown): GenericResponse<T> {
  const response: GenericResponse<T> = {
    success: false,
    message: getErrorMessage(error),
  };

  return response;
}

export function getUuidSuffix(uuid: string): string {
  if (!uuid) {
    return '...';
  }

  return `...${uuid.slice(-6)}`;
}

export function getSuccessResponse<T>(message: string, data: T | null = null): GenericResponse<T | null> {
  const response: GenericResponse<T | null> = {
    success: true,
    message: message,
    data: data,
  };
  return response;
}