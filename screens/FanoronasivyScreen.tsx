import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect } from 'react';
import {
    Alert,
    StatusBar,
} from 'react-native';
import FanoronaSivyComponent from '../components/FanoronaSivy';
import { useFanoronaSivy } from '../usecases/fanoronaSivyGame';

export default function FanoronaSivyScreen() {
  const {
    board,
    currentPlayer,
    selectedPiece,
    validMoves,
    gameOver,
    winner,
    isAIThinking,
    mode,
    setMode,
    reset,
    selectPiece,
    makeMove,
  } = useFanoronaSivy();

  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };
    lockOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  useEffect(() => {
    if (!gameOver) return;
    if (winner === 1) {
      Alert.alert('Fin du jeu', "Vous avez gagné ! L'IA n'a plus de pièces.");
    } else if (winner === 2) {
      Alert.alert('Fin du jeu', "L'IA a gagné ! Vous n'avez plus de pièces.");
    }
  }, [gameOver, winner]);

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    reset();
  };

  return (
    <>
      <StatusBar hidden />
      <FanoronaSivyComponent
        board={board}
        currentPlayer={currentPlayer}
        selectedPiece={selectedPiece}
        validMoves={validMoves}
        isAIThinking={isAIThinking}
        mode={mode}
        onModeSelect={handleModeSelect}
        onReset={reset}
        onSelectPiece={selectPiece}
        onMakeMove={makeMove}
      />
    </>
  );
}