import { useCallback, useMemo, useState } from 'react';
import {
    createEmptyGrid,
    GridSize,
    GridState,
    LetterPairs,
    PathMap,
    placeLetterInGrid,
    solvePairs,
} from '../domain/relieLettre';

export type UseRelieLettreOptions = {
  gridSize?: GridSize;
};

export type UseRelieLettreState = {
  grid: GridState;
  pairs: LetterPairs;
  letterIndex: number;
  paths: PathMap;
  error?: string;
};

export type UseRelieLettreActions = {
  placeLetter: (row: number, col: number) => void;
  solve: () => string | undefined;
  reset: () => void;
};

export type UseRelieLettreReturn = UseRelieLettreState & UseRelieLettreActions;

export function useRelieLettre(options: UseRelieLettreOptions = {}): UseRelieLettreReturn {
  const { gridSize = 6 } = options;

  const [grid, setGrid] = useState<GridState>(() => createEmptyGrid(gridSize));
  const [pairs, setPairs] = useState<LetterPairs>({});
  const [letterIndex, setLetterIndex] = useState(0);
  const [paths, setPaths] = useState<PathMap>({});
  const [error, setError] = useState<string | undefined>(undefined);

  const placeLetter = useCallback(
    (row: number, col: number) => {
      setError(undefined);
      const { grid: nextGrid, pairs: nextPairs, letterIndex: nextLetterIndex } =
        placeLetterInGrid(grid, pairs, letterIndex, row, col, gridSize);
      setGrid(nextGrid);
      setPairs(nextPairs);
      setLetterIndex(nextLetterIndex);
    },
    [grid, pairs, letterIndex, gridSize]
  );

  const solve = useCallback(() => {
    setError(undefined);

    const result = solvePairs(gridSize, grid, pairs);
    if (!result) {
      const msg = 'Aucune solution trouvée pour cette configuration.';
      setError(msg);
      return msg;
    }

    setGrid(result.solvedGrid);
    setPaths(result.paths);
    return undefined;
  }, [grid, pairs, gridSize]);

  const reset = useCallback(() => {
    setGrid(createEmptyGrid(gridSize));
    setPairs({});
    setLetterIndex(0);
    setPaths({});
    setError(undefined);
  }, [gridSize]);

  const remainingLetters = useMemo(() => {
    return Math.max(0, 26 - letterIndex);
  }, [letterIndex]);

  return {
    grid,
    pairs,
    letterIndex,
    paths,
    error,
    placeLetter,
    solve,
    reset,
    // remainingLetters
  };
}
