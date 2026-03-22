import { Cell, Color } from '../domain/cell';
import { Grid } from '../domain/grid';

export const handleSelection = (
  selectedCells: Cell[],
  grid: Grid
): { score: number; updatedGrid: Grid; changedCells: Cell[] } => {
  let score = 0;
  const colors: Color[] = ['red', 'blue', 'green', 'yellow'];
  const changedCells: Cell[] = [];

  // Create an immutable copy of the grid cells so we don't mutate input
  const updatedGrid = new Grid(grid.cells.length);
  updatedGrid.cells = grid.cells.map(row => row.map(cell => ({ ...cell })));

  if (Grid.isRectangle(selectedCells)) {
    // Calcul longueur et hauteur
    const rows = selectedCells.map(c => c.row);
    const cols = selectedCells.map(c => c.col);

    const longeur = Math.max(...cols) - Math.min(...cols) + 1;
    const hauteur = Math.max(...rows) - Math.min(...rows) + 1;

    score = longeur * hauteur;

    // Remplacer les couleurs des cases sélectionnées
    selectedCells.forEach(cell => {
      const newColor = colors[Math.floor(Math.random() * colors.length)];
      updatedGrid.cells[cell.row][cell.col].color = newColor;
      changedCells.push({ ...cell, color: newColor });
    });
  } else {
    // Si ce n'est pas un rectangle
    score = -4; // pénalité
  }

  return { score, updatedGrid, changedCells };
};
