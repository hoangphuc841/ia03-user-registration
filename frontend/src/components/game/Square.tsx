// src/components/game/Square.tsx
import { cn } from '@/lib/utils';

interface SquareProps {
  value: string | null;
  onSquareClick: () => void;
  isWinning: boolean;
}

/**
 * A component that renders a single square in the Tic-Tac-Toe board.
 */
export default function Square({ value, onSquareClick, isWinning }: SquareProps) {
  return (
    <button
      className={cn(
        // Base styles
        'w-20 h-20 border text-5xl font-bold flex items-center justify-center -m-px', // <-- UPDATED
        // Light mode
        'bg-white border-gray-400 text-gray-900',
        // Dark mode
        'dark:bg-gray-800 dark:border-gray-600 dark:text-white',
        // Winning square styles
        isWinning && 'bg-green-100 border-green-600 dark:bg-green-900'
      )}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}