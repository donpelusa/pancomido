// src/hooks/useEncrypt.jsx

import CryptoJs from "crypto-js";
import { useState } from "react";
const { VITE_CRYPTOJS_SECRET } = import.meta.env;

export const useEncrypt = () => {
  const [encrypted, setEncrypted] = useState(null);
  const [decrypted, setDecrypted] = useState(null);

  const handleEncrypt = (data) => {
    const encryptedData = CryptoJs.AES.encrypt(
      JSON.stringify(data),
      String(VITE_CRYPTOJS_SECRET)
    ).toString();

    setEncrypted(encryptedData);
  };

  const handleDecrypt = (encryptedData) => {
    const decryptedData = CryptoJs.AES.decrypt(
      encryptedData,
      String(VITE_CRYPTOJS_SECRET)
    ).toString(CryptoJs.enc.Utf8);

    setDecrypted(decryptedData);
  };

  return {
    encrypted,
    decrypted,
    handleEncrypt,
    handleDecrypt,
  };
};
