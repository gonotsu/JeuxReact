export type BoardCell = 0 | 1 | 2;
export type BoardState = BoardCell[][];

export type Position = { row: number; col: number };

export type CaptureResult = {
  approach: Position[];
  withdrawal: Position[];
};

export type Move = Position & {
  captures: CaptureResult;
  hasCapture: boolean;
};

export type GameMode = '2P' | 'IA' | null;

export const ROWS = 5;
export const COLS = 9;

export const INITIAL_BOARD: BoardState = [
  [2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2],
  [1, 2, 1, 2, 0, 1, 2, 1, 2],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export const cloneBoard = (board: BoardState): BoardState =>
  board.map(row => [...row]);

export const hasDiagonals = (row: number, col: number): boolean =>
  (row + col) % 2 === 0;

export const getNeighbors = (row: number, col: number): Array<Position & { direction: [number, number] }> => {
  const directions: [number, number][] = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  if (hasDiagonals(row, col)) {
    directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
  }

  return directions
    .map(([dr, dc]) => ({ row: row + dr, col: col + dc, direction: [dr, dc] as [number, number] }))
    .filter(({ row: r, col: c }) => r >= 0 && r < ROWS && c >= 0 && c < COLS);
};

export const calculateCaptures = (
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  boardState: BoardState,
  alreadyCaptured: Position[] = []
): CaptureResult => {
  const dr = toRow - fromRow;
  const dc = toCol - fromCol;
  const player = boardState[fromRow][fromCol];
  const enemy: BoardCell = player === 1 ? 2 : 1;

  const captures: CaptureResult = { approach: [], withdrawal: [] };

  let r = toRow + dr;
  let c = toCol + dc;
  while (r >= 0 && r < ROWS && c >= 0 && c < COLS && boardState[r][c] === enemy) {
    if (!alreadyCaptured.some(p => p.row === r && p.col === c)) {
      captures.approach.push({ row: r, col: c });
    }
    r += dr;
    c += dc;
  }

  r = fromRow - dr;
  c = fromCol - dc;
  while (r >= 0 && r < ROWS && c >= 0 && c < COLS && boardState[r][c] === enemy) {
    if (!alreadyCaptured.some(p => p.row === r && p.col === c)) {
      captures.withdrawal.push({ row: r, col: c });
    }
    r -= dr;
    c -= dc;
  }

  return captures;
};

export const hasCaptureMoves = (player: BoardCell, boardState: BoardState): boolean => {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (boardState[row][col] === player) {
        const neighbors = getNeighbors(row, col);
        for (const { row: newRow, col: newCol } of neighbors) {
          if (boardState[newRow][newCol] === 0) {
            const captures = calculateCaptures(row, col, newRow, newCol, boardState);
            if (captures.approach.length > 0 || captures.withdrawal.length > 0) {
              return true;
            }
          }
        }
      }
    }
  }
  return false;
};

export const hasLegalMoves = (player: BoardCell, boardState: BoardState): boolean => {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (boardState[row][col] === player) {
        const neighbors = getNeighbors(row, col);
        for (const { row: newRow, col: newCol } of neighbors) {
          if (boardState[newRow][newCol] === 0) {
            return true;
          }
        }
      }
    }
  }
  return false;
};

export const calculateValidMoves = (
  row: number,
  col: number,
  boardState: BoardState,
  inCapture = false,
  mustCapture = false,
  alreadyCaptured: Position[] = [],
  visited: Position[] = []
): Move[] => {
  const moves: Move[] = [];
  const neighbors = getNeighbors(row, col);

  neighbors.forEach(({ row: newRow, col: newCol }) => {
    if (boardState[newRow][newCol] === 0 && !visited.some(v => v.row === newRow && v.col === newCol)) {
      const captures = calculateCaptures(row, col, newRow, newCol, boardState, alreadyCaptured);
      const hasCapture = captures.approach.length > 0 || captures.withdrawal.length > 0;

      if (inCapture && !hasCapture) return;
      if (mustCapture && !hasCapture) return;

      moves.push({ row: newRow, col: newCol, captures, hasCapture });
    }
  });

  return moves;
};

export const applyMove = (
  boardState: BoardState,
  from: Position,
  move: Move,
  captureType: 'approach' | 'withdrawal' | null,
  alreadyCaptured: Position[] = []
): {
  board: BoardState;
  capturedPositions: Position[];
  newVisited: Position[];
  capturedCount: number;
} => {
  const newBoard = cloneBoard(boardState);
  const capturesToExecute: Position[] =
    captureType && move.captures[captureType]
      ? move.captures[captureType]
      : move.captures.approach.length > 0
      ? move.captures.approach
      : move.captures.withdrawal;

  capturesToExecute.forEach(({ row, col }) => {
    newBoard[row][col] = 0;
  });

  newBoard[move.row][move.col] = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = 0;

  const capturedCount = capturesToExecute.length;
  const newCapturedPositions = [...alreadyCaptured, ...capturesToExecute];
  const newVisited = [...alreadyCaptured, { row: move.row, col: move.col }];

  return {
    board: newBoard,
    capturedPositions: newCapturedPositions,
    newVisited,
    capturedCount,
  };
};

export const findBestAIMove = (
  boardState: BoardState,
  alreadyCaptured: Position[] = []
): { piece: Position | null; move: Move | null; captureType: 'approach' | 'withdrawal' | null } => {
  let bestScore = -Infinity;
  let bestPiece: Position | null = null;
  let bestMove: Move | null = null;
  let bestCaptureType: 'approach' | 'withdrawal' | null = null;

  const mustCapture = hasCaptureMoves(2, boardState);

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (boardState[row][col] === 2) {
        const moves = calculateValidMoves(row, col, boardState, false, mustCapture, alreadyCaptured, []);
        moves.forEach(move => {
          let score = 0;
          let captureType: 'approach' | 'withdrawal' | null = null;

          const approachCount = move.captures.approach.length;
          const withdrawalCount = move.captures.withdrawal.length;

          if (approachCount > 0 && withdrawalCount > 0) {
            if (approachCount >= withdrawalCount) {
              score = approachCount * 10;
              captureType = 'approach';
            } else {
              score = withdrawalCount * 10;
              captureType = 'withdrawal';
            }
          } else if (approachCount > 0) {
            score = approachCount * 10;
            captureType = 'approach';
          } else if (withdrawalCount > 0) {
            score = withdrawalCount * 10;
            captureType = 'withdrawal';
          } else {
            score = (4 - Math.abs(move.row - 2)) + (4 - Math.abs(move.col - 4));
          }

          score += Math.random() * 0.5;

          if (score > bestScore) {
            bestScore = score;
            bestPiece = { row, col };
            bestMove = move;
            bestCaptureType = captureType;
          }
        });
      }
    }
  }

  return { piece: bestPiece, move: bestMove, captureType: bestCaptureType };
};
