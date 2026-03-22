import { ADJACENCY, PLAYERS, WIN_LINES } from '../domain/fanoronatelo';

// Vérifier le gagnant
export const checkWinner = (board) => {
  for (let line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

// Exécuter un mouvement
export const executeMove = (gameState, index, fromIndex = null, player) => {
  const newBoard = [...gameState.board];
  
  if (fromIndex !== null) newBoard[fromIndex] = null;
  newBoard[index] = player;
  
  const winner = checkWinner(newBoard);
  const nextPlayer = player === PLAYERS.P1 ? PLAYERS.P2 : PLAYERS.P1;
  
  return {
    board: newBoard,
    winner,
    nextPlayer,
    selected: null
  };
};

// Vérifier si un mouvement est valide
export const isValidMove = (board, selectedIndex, targetIndex) => {
  return !board[targetIndex] && ADJACENCY[selectedIndex].includes(targetIndex);
};

// Récupérer les positions des pions d'un joueur
export const getPlayerPieces = (board, player) => {
  return board.map((v, i) => v === player ? i : null).filter(v => v !== null);
};

// Trouver tous les mouvements possibles pour un joueur
export const getPossibleMoves = (board, player) => {
  const pieces = getPlayerPieces(board, player);
  const moves = [];
  
  for (let startIndex of pieces) {
    const possibleTargets = ADJACENCY[startIndex].filter(idx => board[idx] === null);
    for (let target of possibleTargets) {
      moves.push({ from: startIndex, to: target });
    }
  }
  
  return moves;
};

// Vérifier si le jeu est terminé (plus de mouvements possibles)
export const isGameOver = (board, currentPlayer) => {
  const moves = getPossibleMoves(board, currentPlayer);
  return moves.length === 0;
};

// Stratégie IA simple (aléatoire)
export const getAIMove = (gameState) => {
  const possibleMoves = getPossibleMoves(gameState.board, PLAYERS.P2);
  
  if (possibleMoves.length === 0) return null;
  
  // Choisir un mouvement aléatoire
  const randomIndex = Math.floor(Math.random() * possibleMoves.length);
  return possibleMoves[randomIndex];
};

// Exécuter le mouvement de l'IA
export const executeAIMove = (gameState) => {
  const move = getAIMove(gameState);
  
  if (!move) return null;
  
  const result = executeMove(gameState, move.to, move.from, PLAYERS.P2);
  return {
    ...result,
    moveExecuted: move
  };
};

// Stratégie IA avancée (optionnelle)
export const getAdvancedAIMove = (gameState) => {
  const possibleMoves = getPossibleMoves(gameState.board, PLAYERS.P2);
  
  if (possibleMoves.length === 0) return null;
  
  // Prioriser les mouvements qui créent des alignements
  for (let move of possibleMoves) {
    const testBoard = [...gameState.board];
    testBoard[move.from] = null;
    testBoard[move.to] = PLAYERS.P2;
    
    const winner = checkWinner(testBoard);
    if (winner === PLAYERS.P2) return move;
  }
  
  // Sinon mouvement aléatoire
  const randomIndex = Math.floor(Math.random() * possibleMoves.length);
  return possibleMoves[randomIndex];
};