import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Reaction {
  id: number;
  emoji: string;
  x: number;
}

interface FloatingReactionsProps {
  reactions: string[];
}

export function FloatingReactions({ reactions }: FloatingReactionsProps) {
  const [activeReactions, setActiveReactions] = useState<Reaction[]>([]);

  useEffect(() => {
    let id = 0;
    const handleNewReaction = (emoji: string) => {
      const x = Math.random() * 80 + 10; // Random position between 10% and 90%
      setActiveReactions(prev => [...prev, { id: id++, emoji, x }]);
      
      // Remove reaction after animation
      setTimeout(() => {
        setActiveReactions(prev => prev.filter(r => r.id !== id - 1));
      }, 3000);
    };

    reactions.forEach(handleNewReaction);
  }, [reactions]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {activeReactions.map(({ id, emoji, x }) => (
          <motion.div
            key={id}
            initial={{ y: '100%', x: `${x}%`, opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 3, ease: 'easeOut' }}
            className="absolute bottom-0 text-2xl"
          >
            {emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}