import { BOX_SIZE, GRID_SIZE } from '../domain/puzzleNombre';

// Vérifier si le jeu est gagné
export const isWin = (grid) => {
  let expected = 1;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] !== expected) {
        return false;
      }
      expected++;
    }
  }
  return true;
};

// Rotation à gauche
export const rotateLeft = (grid, row, col) => {
  const newGrid = grid.map(r => [...r]);
  const a = grid[row][col];
  const b = grid[row][col + 1];
  const c = grid[row + 1][col];
  const d = grid[row + 1][col + 1];
  
  newGrid[row][col] = b;
  newGrid[row][col + 1] = d;
  newGrid[row + 1][col] = a;
  newGrid[row + 1][col + 1] = c;
  
  return newGrid;
};

// Rotation à droite
export const rotateRight = (grid, row, col) => {
  const newGrid = grid.map(r => [...r]);
  const a = grid[row][col];
  const b = grid[row][col + 1];
  const c = grid[row + 1][col];
  const d = grid[row + 1][col + 1];
  
  newGrid[row][col] = c;
  newGrid[row][col + 1] = a;
  newGrid[row + 1][col] = d;
  newGrid[row + 1][col + 1] = b;
  
  return newGrid;
};

// Effectuer une rotation en fonction de la direction
export const performRotation = (grid, row, col, direction) => {
  if (direction === 'left') {
    return rotateLeft(grid, row, col);
  } else if (direction === 'right') {
    return rotateRight(grid, row, col);
  }
  return grid;
};

// Calculer la nouvelle position sélectionnée
export const getNewSelectedPosition = (row, col, gridSize) => {
  const newRow = Math.min(row, gridSize - 2);
  const newCol = Math.min(col, gridSize - 2);
  return { row: newRow, col: newCol };
};

// Vérifier si une cellule est dans la zone sélectionnée
export const isCellInSelectedArea = (cellRow, cellCol, selectedRow, selectedCol) => {
  return cellRow >= selectedRow &&
         cellRow < selectedRow + BOX_SIZE &&
         cellCol >= selectedCol &&
         cellCol < selectedCol + BOX_SIZE;
};

// Obtenir les valeurs du bloc sélectionné
export const getSelectedBlockValues = (grid, row, col) => {
  const values = [];
  for (let i = 0; i < BOX_SIZE; i++) {
    values[i] = [];
    for (let j = 0; j < BOX_SIZE; j++) {
      values[i][j] = grid[row + i][col + j];
    }
  }
  return values;
};

// Mélanger le plateau (optionnel)
export const shuffleGrid = (grid, moves = 20) => {
  let newGrid = grid.map(row => [...row]);
  const directions = ['left', 'right'];
  const maxRow = GRID_SIZE - 2;
  const maxCol = GRID_SIZE - 2;
  
  for (let i = 0; i < moves; i++) {
    const randomRow = Math.floor(Math.random() * maxRow);
    const randomCol = Math.floor(Math.random() * maxCol);
    const randomDir = directions[Math.floor(Math.random() * directions.length)];
    newGrid = performRotation(newGrid, randomRow, randomCol, randomDir);
  }
  
  return newGrid;
};