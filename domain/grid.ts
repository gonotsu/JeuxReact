import { Cell, Color } from './cell';

export class Grid {
  cells: Cell[][];

  constructor(size: number) {
    this.cells = this.generate(size);
  }

  generate(size: number): Cell[][] {
    const colors: Color[] = ['red', 'blue', 'green', 'yellow'];
    const grid: Cell[][] = [];
    for (let r = 0; r < size; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < size; c++) {
        row.push({
          row: r,
          col: c,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      grid.push(row);
    }
    return grid;
  }

  static isRectangle(cells: Cell[]): boolean {
    if (cells.length !== 4) return false;
    const rows = new Set(cells.map(c => c.row));
    const cols = new Set(cells.map(c => c.col));
    return rows.size === 2 && cols.size === 2;
  }
}
