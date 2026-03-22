// Constantes du jeu
export const GRID_SIZE = 4;
export const BOX_SIZE = 2;

// Classe pour représenter l'état du jeu
export class GameState {
  constructor(grid, selectedRow, selectedCol) {
    this.grid = grid || this.getInitialGrid();
    this.selectedRow = selectedRow !== undefined ? selectedRow : 1;
    this.selectedCol = selectedCol !== undefined ? selectedCol : 1;
  }

  getInitialGrid() {
    const grid = [];
    let value = 1;
    for (let i = 0; i < GRID_SIZE; i++) {
      grid[i] = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        grid[i][j] = value++;
      }
    }
    return grid;
  }

  clone() {
    return new GameState(
      this.grid.map(row => [...row]),
      this.selectedRow,
      this.selectedCol
    );
  }
}

// Classe pour représenter une rotation
export class Rotation {
  constructor(row, col, direction) {
    this.row = row;
    this.col = col;
    this.direction = direction; // 'left' ou 'right'
  }
}