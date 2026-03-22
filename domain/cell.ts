// Cell.ts
export type Color = 'red' | 'blue' | 'green' | 'yellow';

export interface Cell {
  row: number;
  col: number;
  color: Color;
}
