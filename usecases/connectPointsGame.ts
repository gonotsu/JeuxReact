import { useCallback, useMemo, useState } from 'react';
import {
  ConnectPoint,
  GridCoord,
  GridSize,
  Path,
  solveConnectPoints,
} from '../domain/connectPoints';

const DEFAULT_GRID_SIZE: GridSize = 12;

export type UseConnectPointsGameOptions = {
  initialNumPairs?: number;
  gridSize?: GridSize;
  emojis?: string[];
};

export type UseConnectPointsGameReturn = {
  numPairs: number;
  gridSize: GridSize;
  placedPoints: ConnectPoint[];
  paths: Path[];
  isSolved: boolean;
  error?: string;
  placePoint: (coord: GridCoord) => void;
  reset: () => void;
  solve: () => string | undefined;
  remainingPairs: number;
};

const DEFAULT_EMOJIS = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🥝', '🍍'];

export function useConnectPointsGame(
  options: UseConnectPointsGameOptions = {}
): UseConnectPointsGameReturn {
  const { initialNumPairs = 3, gridSize = DEFAULT_GRID_SIZE, emojis } = options;
  const emojiSet = emojis ?? DEFAULT_EMOJIS;

  const [numPairs] = useState(initialNumPairs);
  const [placedPoints, setPlacedPoints] = useState<ConnectPoint[]>([]);
  const [paths, setPaths] = useState<Path[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const remainingPairs = useMemo(() => {
    const remaining = Math.ceil((numPairs * 2 - placedPoints.length) / 2);
    return Math.max(0, remaining);
  }, [numPairs, placedPoints.length]);

  const reset = useCallback(() => {
    setPlacedPoints([]);
    setPaths([]);
    setIsSolved(false);
    setError(undefined);
  }, []);

  const placePoint = useCallback(
    (coord: GridCoord) => {
      if (isSolved) return;

      // already placed
      if (placedPoints.some(p => p.position.x === coord.x && p.position.y === coord.y)) {
        return;
      }

      if (placedPoints.length >= numPairs * 2) return;

      const pairIndex = Math.floor(placedPoints.length / 2);
      const emoji = emojiSet[pairIndex] ?? emojiSet[0];
      const newPoint: ConnectPoint = {
        id: pairIndex,
        emoji,
        position: coord,
      };

      setPlacedPoints(prev => [...prev, newPoint]);
    },
    [emojiSet, isSolved, numPairs, placedPoints]
  );

  const solve = useCallback(() => {
    setError(undefined);

    if (placedPoints.length < numPairs * 2) {
      const msg = 'Veuillez placer toutes les paires avant de résoudre.';
      setError(msg);
      return msg;
    }

    const solvedPaths = solveConnectPoints(placedPoints, gridSize);

    if (!solvedPaths) {
      const msg = 'Aucune solution globale n’existe pour cette configuration.';
      setError(msg);
      return msg;
    }

    setPaths(solvedPaths);
    setIsSolved(true);
    return undefined;
  }, [gridSize, numPairs, placedPoints]);

  return {
    numPairs,
    gridSize,
    placedPoints,
    paths,
    isSolved,
    error,
    placePoint,
    reset,
    solve,
    remainingPairs,
  };
}
