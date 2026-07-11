'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function EasterEggs() {
  const [konamiMessage, setKonamiMessage] = useState(false);

  const konamiSequence = useCallback(() => {
    const code = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA',
    ];
    let position = 0;

    const handler = (e: KeyboardEvent) => {
      if (e.code === code[position]) {
        position++;
        if (position === code.length) {
          setKonamiMessage(true);
          setTimeout(() => setKonamiMessage(false), 4000);
          position = 0;
        }
      } else {
        position = 0;
      }
    };

    return handler;
  }, []);

  useEffect(() => {
    const handler = konamiSequence();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [konamiSequence]);

  return (
    <AnimatePresence>
      {konamiMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-primary/30 bg-card px-6 py-3 shadow-2xl"
        >
          <p className="text-sm text-primary">
            🎮 Achievement Unlocked: You know the code!
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Built with ❤️ by developers who love Easter eggs.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
