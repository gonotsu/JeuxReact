import { useCallback, useEffect, useState } from 'react';
import {
    applyMove,
    BoardCell,
    BoardState,
    calculateValidMoves,
    findBestAIMove,
    hasCaptureMoves,
    hasLegalMoves,
    INITIAL_BOARD,
    Move,
    Position
} from '../domain/fanorona';

export type FanoronaMode = '2P' | 'IA' | null;

export type FanoronaSivyState = {
  board: BoardState;
  currentPlayer: BoardCell;
  selectedPiece: Position | null;
  validMoves: Move[];
  captureInProgress: boolean;
  visitedPositions: Position[];
  capturedPositions: Position[];
  gameOver: boolean;
  winner: BoardCell | null;
  scores: { player: number; ai: number };
  isAIThinking: boolean;
  mode: FanoronaMode;
};

export type FanoronaSivyActions = {
  setMode: (mode: FanoronaMode) => void;
  reset: () => void;
  selectPiece: (row: number, col: number) => void;
  makeMove: (move: Move, captureType?: 'approach' | 'withdrawal' | null) => void;
};

export type UseFanoronaSivyReturn = FanoronaSivyState & FanoronaSivyActions;

const INITIAL_SCORE = 22;

export function useFanoronaSivy(): UseFanoronaSivyReturn {
  const [mode, setMode] = useState<FanoronaMode>(null);
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState<BoardCell>(1);
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [captureInProgress, setCaptureInProgress] = useState(false);
  const [visitedPositions, setVisitedPositions] = useState<Position[]>([]);
  const [capturedPositions, setCapturedPositions] = useState<Position[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<BoardCell | null>(null);
  const [scores, setScores] = useState({ player: INITIAL_SCORE, ai: INITIAL_SCORE });
  const [isAIThinking, setIsAIThinking] = useState(false);

  const endTurn = useCallback(() => {
    setSelectedPiece(null);
    setValidMoves([]);
    setCaptureInProgress(false);
    setVisitedPositions([]);
    setCapturedPositions([]);
    setCurrentPlayer(prev => (prev === 1 ? 2 : 1));
  }, []);

  const updateScoresFromCapture = useCallback(
    (capturedCount: number) => {
      setScores(prev => ({
        ...prev,
        [currentPlayer === 1 ? 'ai' : 'player']: prev[currentPlayer === 1 ? 'ai' : 'player'] - capturedCount,
      }));
    },
    [currentPlayer]
  );

  const handleMoveExecution = useCallback(
    (from: Position, move: Move, captureType: 'approach' | 'withdrawal' | null) => {
      const { board: nextBoard, capturedPositions: nextCapturedPositions, newVisited, capturedCount } =
        applyMove(board, from, move, captureType, capturedPositions);

      setBoard(nextBoard);
      setCapturedPositions(nextCapturedPositions);
      setVisitedPositions(newVisited);
      updateScoresFromCapture(capturedCount);
      setSelectedPiece({ row: move.row, col: move.col });

      const continueMoves = calculateValidMoves(
        move.row,
        move.col,
        nextBoard,
        true,
        false,
        nextCapturedPositions,
        newVisited
      );

      if (continueMoves.length > 0 && currentPlayer === 1) {
        setValidMoves(continueMoves);
        setCaptureInProgress(true);
      } else {
        endTurn();
      }
    },
    [board, capturedPositions, currentPlayer, endTurn, updateScoresFromCapture]
  );

  const selectPiece = useCallback(
    (row: number, col: number) => {
      if (gameOver || isAIThinking) return;

      if (captureInProgress) {
        if (selectedPiece && selectedPiece.row === row && selectedPiece.col === col) {
          setSelectedPiece(null);
          setValidMoves([]);
          setCaptureInProgress(false);
          setVisitedPositions([]);
          setCapturedPositions([]);
        }
        return;
      }

      const cell = board[row][col];
      if (cell !== currentPlayer) {
        setSelectedPiece(null);
        setValidMoves([]);
        return;
      }

      const mustCapture = hasCaptureMoves(currentPlayer, board);
      setSelectedPiece({ row, col });
      setValidMoves(calculateValidMoves(row, col, board, false, mustCapture, [], []));
      setVisitedPositions([{ row, col }]);
      setCapturedPositions([]);

      if (mustCapture && validMoves.length === 0) {
        // This can occur if there are no captures available for this piece
        setSelectedPiece(null);
      }
    },
    [board, captureInProgress, currentPlayer, gameOver, isAIThinking, selectedPiece, validMoves]
  );

  const makeMove = useCallback(
    (move: Move, captureType: 'approach' | 'withdrawal' | null = null) => {
      if (gameOver || isAIThinking || !selectedPiece) return;
      if (mode === 'IA' && currentPlayer !== 1) return;

      const hasApproach = move.captures.approach.length > 0;
      const hasWithdrawal = move.captures.withdrawal.length > 0;

      if (captureType) {
        handleMoveExecution(selectedPiece, move, captureType);
      } else if (hasApproach) {
        handleMoveExecution(selectedPiece, move, 'approach');
      } else if (hasWithdrawal) {
        handleMoveExecution(selectedPiece, move, 'withdrawal');
      } else {
        handleMoveExecution(selectedPiece, move, null);
      }
    },
    [captureInProgress, currentPlayer, gameOver, handleMoveExecution, isAIThinking, mode, selectedPiece]
  );

  const runAIMove = useCallback(
    (boardState: BoardState, alreadyCaptured: Position[] = [], visited: Position[] = []) => {
      setIsAIThinking(true);
      const { piece, move, captureType } = findBestAIMove(boardState, alreadyCaptured);

      if (!piece || !move) {
        setIsAIThinking(false);
        endTurn();
        return;
      }

      const { board: newBoard, capturedPositions: nextCapturedPositions, newVisited, capturedCount } =
        applyMove(boardState, piece, move, captureType, alreadyCaptured);

      setBoard(newBoard);
      setScores(prev => ({ ...prev, player: prev.player - capturedCount }));

      if (captureType) {
        const continueMoves = calculateValidMoves(
          move.row,
          move.col,
          newBoard,
          true,
          false,
          nextCapturedPositions,
          newVisited
        ).filter(m => !newVisited.some(v => v.row === m.row && v.col === m.col));

        if (continueMoves.length > 0) {
          const bestContinue = continueMoves.reduce((best, m) => {
            const captureCount = Math.max(m.captures.approach.length, m.captures.withdrawal.length);
            return Math.max(best, captureCount);
          }, 0);

          if (bestContinue >= 2) {
            runAIMove(newBoard, nextCapturedPositions, newVisited);
            return;
          }
        }
      }

      setIsAIThinking(false);
      setCurrentPlayer(1);
    },
    [endTurn]
  );

  useEffect(() => {
    if (mode === 'IA' && currentPlayer === 2 && !gameOver) {
      runAIMove(board);
    }
  }, [board, currentPlayer, gameOver, mode, runAIMove]);

  useEffect(() => {
    const player1Pieces = board.flat().filter(p => p === 1).length;
    const player2Pieces = board.flat().filter(p => p === 2).length;

    if (!gameOver) {
      if (player1Pieces === 0) {
        setGameOver(true);
        setWinner(2);
      } else if (player2Pieces === 0) {
        setGameOver(true);
        setWinner(1);
      } else if (!captureInProgress && currentPlayer === 1 && !hasLegalMoves(1, board)) {
        setGameOver(true);
        setWinner(2);
      } else if (!captureInProgress && currentPlayer === 2 && !hasLegalMoves(2, board)) {
        setGameOver(true);
        setWinner(1);
      }
    }
  }, [board, captureInProgress, currentPlayer, gameOver]);

  const reset = useCallback(() => {
    setBoard(INITIAL_BOARD);
    setCurrentPlayer(1);
    setSelectedPiece(null);
    setValidMoves([]);
    setCaptureInProgress(false);
    setVisitedPositions([]);
    setCapturedPositions([]);
    setGameOver(false);
    setWinner(null);
    setScores({ player: INITIAL_SCORE, ai: INITIAL_SCORE });
    setIsAIThinking(false);
  }, []);

  return {
    board,
    currentPlayer,
    selectedPiece,
    validMoves,
    captureInProgress,
    visitedPositions,
    capturedPositions,
    gameOver,
    winner,
    scores,
    isAIThinking,
    mode,
    setMode,
    reset,
    selectPiece,
    makeMove,
  };
}
