import { useEffect } from 'react';

const useEscapeKey = (isOpen: boolean, onEscape: () => void) => {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onEscape]);
};

export default useEscapeKey;
