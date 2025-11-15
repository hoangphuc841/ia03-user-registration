// src/pages/GamePage.tsx
import { useState } from 'react';
import Board from '@/components/game/Board';
import { Button } from '@/components/ui/button'; 

interface HistoryStep {
  squares: (string | null)[];
  location: { row: number, col: number } | null;
}

/**
 * The main Game component that manages the game's state, history, and move list.
 */
export default function GamePage() {
  const [history, setHistory] = useState<HistoryStep[]>([
    {
      squares: Array(9).fill(null),
      location: null,
    },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares: (string | null)[], i: number) {
    const row = Math.floor(i / 3) + 1;
    const col = (i % 3) + 1;
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, location: { row, col } },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  function handleSortToggle() {
    setIsAscending(!isAscending);
  }

  let moves = history.map((step, move) => {
    const locationText = step.location ? `(${step.location.row}, ${step.location.col})` : '';
    let description;

    if (move === currentMove) {
      description = `You are at move #${move} ${locationText}`;
      return (
        <li key={move} className="mb-1.5">
          <span className="flex items-center h-8 px-3 font-medium text-sm text-foreground">
            {description}
          </span>
        </li>
      );
    }

    description = move > 0
      ? `Go to move #${move} ${locationText}`
      : 'Go to game start';

    return (
      <li key={move} className="mb-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => jumpTo(move)}
          className="w-full justify-start"
        >
          {description}
        </Button>
      </li>
    );
  });

  if (!isAscending) {
    moves.reverse();
  }

  return (
    // Wrap with a centering div
    <div className="flex justify-center pt-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info md:ml-5">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSortToggle}
            className="mb-2"
          >
            Sort by: {isAscending ? 'Ascending' : 'Descending'}
          </Button>
          <ol className="pl-8 list-decimal">
            {moves}
          </ol>
        </div>
      </div>
    </div>
  );
}