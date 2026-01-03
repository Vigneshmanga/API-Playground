import { ApiKeyRow } from "@/lib/supabase";

// ============== Types ==============

export interface ApiKey {
  id: string;
  name: string;
  key: string; // Maps to 'value' in the database
  createdAt: string;
  usage: number;
  usageLimit: number;
}

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  message: string;
  type: ToastType;
}

// Re-export for convenience
export type { ApiKeyRow };

// ============== API Key Utilities ==============

/**
 * Generates a new API key with format: nani_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
export function generateApiKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const segments = [8, 4, 4, 4, 12];
  return "nani_" + segments.map(len => 
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  ).join("-");
}

/**
 * Converts a database row to the frontend ApiKey format
 */
export function rowToApiKey(row: ApiKeyRow): ApiKey {
  return {
    id: row.id,
    name: row.name,
    key: row.value, // 'value' in DB maps to 'key' in frontend
    createdAt: row.created_at,
    usage: row.usage ?? 0,
    usageLimit: row.usage_limit ?? 1000,
  };
}

/**
 * Masks an API key for display, showing only first 8 and last 4 characters
 */
export function maskKey(key: string): string {
  return key.substring(0, 8) + "•".repeat(32) + key.substring(key.length - 4);
}

// ============== Formatters ==============

/**
 * Formats a date string to a human-readable format
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

