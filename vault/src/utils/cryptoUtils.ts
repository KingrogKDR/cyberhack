import crypto from "crypto";

interface EncryptedField {
  iv: string;
  value: string;
}

interface EncryptedResult {
  encrypted: Record<string, EncryptedField>;
  keys: Record<string, string>;
}

export function encryptFields(data: Record<string, string>): EncryptedResult {
  const encrypted: Record<string, EncryptedField> = {};
  const keys: Record<string, string> = {};

  for (const [field, value] of Object.entries(data)) {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

    let encryptedField = cipher.update(value, "utf-8", "hex");
    encryptedField += cipher.final("hex");

    encrypted[field] = {
      iv: iv.toString("hex"),
      value: encryptedField,
    };
    keys[field] = key.toString("hex");
  }

  return { encrypted, keys };
}

export function decryptFields(
  encrypted: string,
  keyHex: string,
  ivHex: string
): string {
  const key = Buffer.from(keyHex, "hex");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  let decrypted = decipher.update(encrypted, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}
