// Constantes du jeu
export const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontales
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticales
  [0, 4, 8], [2, 4, 6]             // Diagonales
];

export const ADJACENCY = {
  0: [1, 3, 4], 1: [0, 2, 4], 2: [1, 4, 5],
  3: [0, 4, 6], 4: [0, 1, 2, 3, 5, 6, 7, 8],
  5: [2, 4, 8], 6: [3, 4, 7], 7: [6, 4, 8], 8: [7, 4, 5]
};

export const INITIAL_BOARD = [
  null, 'P1', 'P1',
  'P2', null, 'P1',
  'P2', 'P2', null
];

export const PLAYERS = {
  P1: 'P1',
  P2: 'P2'
};

// Classe pour représenter l'état du jeu
export class GameState {
  constructor(board, currentPlayer, phase, selected) {
    this.board = board || [...INITIAL_BOARD];
    this.currentPlayer = currentPlayer || PLAYERS.P1;
    this.phase = phase || 'PLACEMENT';
    this.selected = selected || null;
  }

  clone() {
    return new GameState(
      [...this.board],
      this.currentPlayer,
      this.phase,
      this.selected
    );
  }
}