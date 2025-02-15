// // frontend/src/hooks/useStorage.jsx

import { useEffect } from "react";
import { useEncrypt } from "./useEncrypt";

export const useStorage = () => {
  const { encrypted, decrypted, handleEncrypt, handleDecrypt } = useEncrypt();

  const handleSetStorageSession = (session) => {
    const sessionStr = JSON.stringify(session);
    handleEncrypt(sessionStr);
  };

  const handleGetStorageSession = () => {
    const stored = localStorage.getItem("USER_SESSION");
    if (stored) {
      handleDecrypt(stored);
    }
    return stored;
  };

  useEffect(() => {
    if (encrypted) {
      localStorage.setItem("USER_SESSION", encrypted);
    }
  }, [encrypted]);

  return { handleSetStorageSession, handleGetStorageSession, decrypted };
};
