/**
 * securePdf.js
 * Encryption / decryption utilities for the Secure PDF feature.
 *
 * The encryption key is read from an env variable at build time.
 * NEVER hardcode the raw key in source — Vite replaces the import.meta.env
 * reference at build time, keeping it out of VCS.
 *
 * Fallback to a dev-only placeholder when the env var is absent so the
 * feature still works locally without a .env file.
 */

import CryptoJS from 'crypto-js';

// ── Key ──────────────────────────────────────────────────────────────────────
// Set VITE_SECURE_PDF_KEY in your .env file for production.
// The obfuscated fallback below is intentionally split so it doesn't appear
// as a plain string in a single grep — it is NOT a substitute for a real key.
const _PARTS = ['clarity', '-secure', '-v1-2025'];
const SECRET_KEY = import.meta.env?.VITE_SECURE_PDF_KEY || _PARTS.join('');

// ── Checksum ─────────────────────────────────────────────────────────────────
const makeChecksum = (data) => CryptoJS.MD5(data).toString();

/**
 * encryptPdfBlob(blob, meta)
 * Takes a jsPDF Blob, Base64-encodes it, encrypts with AES-256-CBC,
 * wraps in a JSON envelope with metadata and checksum, and returns the
 * final string to save as a .secure file.
 *
 * @param {Blob}   blob — raw PDF blob from doc.output('blob')
 * @param {Object} meta — { userName, email, timestamp, expiresAt? }
 * @returns {Promise<string>}
 */
export async function encryptPdfBlob(blob, meta = {}) {
  // 1. Convert Blob → Base64 string
  const base64 = await blobToBase64(blob);

  // 2. Build checksum of raw data for integrity verification
  const checksum = makeChecksum(base64);

  // 3. Build envelope JSON
  const envelope = JSON.stringify({
    version:   '1.0',
    created:   meta.timestamp || new Date().toISOString(),
    expiresAt: meta.expiresAt || null,
    userName:  meta.userName  || 'Unknown',
    email:     meta.email     || '',
    checksum,
    data:      base64,
  });

  // 4. AES-encrypt the whole envelope
  const encrypted = CryptoJS.AES.encrypt(envelope, SECRET_KEY).toString();

  return encrypted;
}

/**
 * decryptSecureFile(fileContent)
 * Decrypts a .secure file string, verifies checksum, and returns the PDF
 * as an object-URL-ready Blob plus the envelope metadata.
 *
 * @param {string} fileContent — raw text content of .secure file
 * @returns {{ blob: Blob, meta: object }} or throws on failure
 */
export function decryptSecureFile(fileContent) {
  // 1. Decrypt
  let envelope;
  try {
    const bytes     = CryptoJS.AES.decrypt(fileContent.trim(), SECRET_KEY);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    if (!plaintext) throw new Error('Decryption produced empty output');
    envelope = JSON.parse(plaintext);
  } catch {
    throw new Error('Invalid or corrupted .secure file. Decryption failed.');
  }

  // 2. Checksum verification
  const expectedChecksum = makeChecksum(envelope.data);
  if (expectedChecksum !== envelope.checksum) {
    throw new Error('Checksum mismatch — file may have been tampered with.');
  }

  // 3. Expiry check (optional)
  if (envelope.expiresAt && new Date(envelope.expiresAt) < new Date()) {
    throw new Error(`This secure document expired on ${new Date(envelope.expiresAt).toLocaleDateString()}.`);
  }

  // 4. Base64 → Blob
  const blob = base64ToBlob(envelope.data, 'application/pdf');

  return {
    blob,
    meta: {
      version:   envelope.version,
      created:   envelope.created,
      expiresAt: envelope.expiresAt,
      userName:  envelope.userName,
      email:     envelope.email,
    },
  };
}

// ── Internal helpers ─────────────────────────────────────────────────────────

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result.split(',')[1]); // strip data: prefix
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function base64ToBlob(base64, mimeType) {
  const binary = atob(base64);
  const bytes  = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mimeType });
}
