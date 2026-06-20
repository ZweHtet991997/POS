import CryptoJS from 'crypto-js';

// Vite exposes env vars via import.meta.env (not process.env)
const encryptionKey = import.meta.env.VITE_PRIVATE_KEY;

const _EncryptService = (raw) => {
  const iv  = CryptoJS.lib.WordArray.random(16);
  const key = CryptoJS.enc.Utf8.parse(encryptionKey);

  const encrypted = CryptoJS.AES.encrypt(raw, key, {
    iv,
    mode:    CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Combine IV + ciphertext → Base64
  const encryptedString = iv
    .concat(encrypted.ciphertext)
    .toString(CryptoJS.enc.Base64);

  return encryptedString;
};

const _DecryptService = (encryptedText) => {
  if (!encryptedText) return '';

  const key = CryptoJS.enc.Utf8.parse(encryptionKey);

  const encryptedWordArray = CryptoJS.enc.Base64.parse(encryptedText);

  // First 16 bytes = IV
  const iv         = CryptoJS.lib.WordArray.create(encryptedWordArray.words.slice(0, 4));
  const ciphertext = CryptoJS.lib.WordArray.create(encryptedWordArray.words.slice(4));

  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext },
    key,
    { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );

  return CryptoJS.enc.Utf8.stringify(decrypted);
};

export { _EncryptService, _DecryptService };