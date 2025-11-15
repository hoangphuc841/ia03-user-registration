import Square from './Square';
import { calculateWinner } from '@/lib/gameLogic';

interface BoardProps {
  xIsNext: boolean;
  squares: (string | null)[];
  onPlay: (nextSquares: (string | null)[], i: number) => void;
}

/**
 * A component that renders the 3x3 Tic-Tac-Toe board.
 */
export default function Board({ xIsNext, squares, onPlay }: BoardProps) {
  function handleClick(i: number) {
    const winInfo = calculateWinner(squares);
    if (winInfo || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, i);
  }

  const winInfo = calculateWinner(squares);
  const winner = winInfo ? winInfo.winner : null;
  const winLine = winInfo ? winInfo.line : null;

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (squares.every(square => square !== null)) {
    status = 'Draw! Game Over';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const squares_row = [];
    for (let col = 0; col < 3; col++) {
      const squareIndex = row * 3 + col;
      squares_row.push(
        <Square
          key={squareIndex}
          value={squares[squareIndex]}
          onSquareClick={() => handleClick(squareIndex)}
          isWinning={!!(winLine && winLine.includes(squareIndex))}
        />
      );
    }
    boardRows.push(
      // Use flex to arrange squares in a row
      <div key={row} className="flex">
        {squares_row}
      </div>
    );
  }

  return (
    <>
      <div className="mb-2.5 text-lg font-semibold">{status}</div>
      {boardRows}
    </>
  );
}