import React, { useState } from 'react';
import { Alert } from 'react-native';
import NumberPuzzleComponent from '../components/PuzzleNumber';
import { GameState, GRID_SIZE } from '../domain/puzzleNombre';
import {
    getNewSelectedPosition,
    isWin,
    performRotation,
    shuffleGrid
} from '../usecases/puzzleNumber';

export default function NumberPuzzleScreen() {
  const [gameState, setGameState] = useState(new GameState());

  const handleMoveLeft = () => {
    const { grid, selectedRow, selectedCol } = gameState;
    
    // Effectuer la rotation à gauche
    const newGrid = performRotation(grid, selectedRow, selectedCol, 'left');
    
    // Vérifier la victoire
    if (isWin(newGrid)) {
      Alert.alert('Bravo !', 'Vous avez gagné !');
    }
    
    // Mettre à jour l'état
    setGameState(new GameState(newGrid, selectedRow, selectedCol));
  };

  const handleMoveRight = () => {
    const { grid, selectedRow, selectedCol } = gameState;
    
    // Effectuer la rotation à droite
    const newGrid = performRotation(grid, selectedRow, selectedCol, 'right');
    
    // Vérifier la victoire
    if (isWin(newGrid)) {
      Alert.alert('Bravo !', 'Vous avez gagné !');
    }
    
    // Mettre à jour l'état
    setGameState(new GameState(newGrid, selectedRow, selectedCol));
  };

  const handleCellPress = (row, col) => {
    const { newRow, newCol } = getNewSelectedPosition(row, col, GRID_SIZE);
    
    setGameState(new GameState(
      gameState.grid,
      newRow,
      newCol
    ));
  };

  const handleReset = () => {
    setGameState(new GameState());
  };

  const handleShuffle = () => {
    const shuffledGrid = shuffleGrid(gameState.grid, 30);
    setGameState(new GameState(shuffledGrid, gameState.selectedRow, gameState.selectedCol));
  };

  return (
    <NumberPuzzleComponent
      grid={gameState.grid}
      selectedRow={gameState.selectedRow}
      selectedCol={gameState.selectedCol}
      onCellPress={handleCellPress}
      onMoveLeft={handleMoveLeft}
      onMoveRight={handleMoveRight}
    />
  );
}