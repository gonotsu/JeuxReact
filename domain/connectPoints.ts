export type GridCoord = { x: number; y: number };
export type GridSize = number;

export type ConnectPoint = {
  id: number;
  emoji: string;
  position: GridCoord;
};

export type Path = {
  points: GridCoord[];
  color: string;
};

export type SolveResult = {
  paths: Path[];
  isSolved: boolean;
};

export const pointKey = (point: GridCoord) => `${point.x},${point.y}`;

export const isInsideGrid = (point: GridCoord, gridSize: GridSize) =>
  point.x >= 0 && point.x < gridSize && point.y >= 0 && point.y < gridSize;

export const makePathColor = (pairIndex: number, numPairs: number) =>
  `hsl(${(pairIndex * 360) / Math.max(1, numPairs)}, 80%, 60%)`;

export const findPath = (
  start: GridCoord,
  end: GridCoord,
  gridSize: GridSize,
  blockedCells: Set<string>
): GridCoord[] | null => {
  const queue: GridCoord[][] = [[start]];
  const visited = new Set<string>([pointKey(start)]);

  const directions: GridCoord[] = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  while (queue.length > 0) {
    const path = queue.shift()!;
    const current = path[path.length - 1];

    if (current.x === end.x && current.y === end.y) {
      return path;
    }

    for (const dir of directions) {
      const next: GridCoord = { x: current.x + dir.x, y: current.y + dir.y };
      const key = pointKey(next);

      if (
        isInsideGrid(next, gridSize) &&
        !visited.has(key) &&
        (!blockedCells.has(key) || (next.x === end.x && next.y === end.y))
      ) {
        visited.add(key);
        queue.push([...path, next]);
      }
    }
  }

  return null;
};

export const solveConnectPoints = (
  placedPoints: ConnectPoint[],
  gridSize: GridSize
): Path[] | null => {
  const numPairs = Math.floor(placedPoints.length / 2);

  const pairs = Array.from({ length: numPairs }).map((_, index) => {
    const start = placedPoints[index * 2];
    const end = placedPoints[index * 2 + 1];
    return { start, end, id: index };
  });

  const currentBlocked = new Set<string>(
    placedPoints.map(p => pointKey(p.position))
  );
  const finalPaths: Path[] = [];

  const solveRecursively = (pairIndex: number): boolean => {
    if (pairIndex === pairs.length) return true;

    const { start, end, id } = pairs[pairIndex];
    const path = findPath(start.position, end.position, gridSize, currentBlocked);

    if (!path) return false;

    const pathKey = makePathColor(id, numPairs);
    finalPaths.push({ points: path, color: pathKey });

    path.forEach(p => currentBlocked.add(pointKey(p)));

    if (solveRecursively(pairIndex + 1)) {
      return true;
    }

    // backtrack
    finalPaths.pop();
    path.forEach(p => {
      const key = pointKey(p);
      const isEndpoint = placedPoints.some(
        pp => pointKey(pp.position) === key
      );
      if (!isEndpoint) {
        currentBlocked.delete(key);
      }
    });

    return false;
  };

  return solveRecursively(0) ? finalPaths : null;
};
