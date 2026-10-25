import { useState, useEffect } from 'react';

// Like useState, but the value survives reloads. `initial` may be a function (lazy).
export default function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) return JSON.parse(saved);
    } catch { /* corrupt or blocked storage: fall through to default */ }
    return typeof initial === 'function' ? initial() : initial;
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota/private mode */ }
  }, [key, value]);
  return [value, setValue];
}
