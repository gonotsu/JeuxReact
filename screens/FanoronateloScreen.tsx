import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import FanoronaTeloComponent from '../components/FanoronaTelo';
import { GameState, PLAYERS } from '../domain/fanoronatelo';
import {
    checkWinner,
    executeAIMove,
    executeMove,
    isGameOver,
    isValidMove
} from '../usecases/fanoronatelo';

export default function FanoronaTeloScreen() {
  const [gameState, setGameState] = useState(new GameState());
  const [vsAI, setVsAI] = useState(true);

  // Effet pour l'IA
  useEffect(() => {
    if (!vsAI) return;
    if (gameState.currentPlayer === PLAYERS.P2 && !checkWinner(gameState.board)) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, vsAI, gameState.board]);

  const makeAIMove = () => {
    const result = executeAIMove(gameState);
    
    if (result) {
      const winner = result.winner;
      setGameState(prev => new GameState(
        result.board,
        result.nextPlayer,
        prev.phase,
        result.selected
      ));

      if (winner) {
        handleGameEnd(winner);
      }
    } else {
      // Vérifier si le jeu est terminé
      if (isGameOver(gameState.board, gameState.currentPlayer)) {
        handleGameEnd(gameState.currentPlayer === PLAYERS.P1 ? PLAYERS.P2 : PLAYERS.P1);
      }
    }
  };

  const handleGameEnd = (winner) => {
    Vibration.vibrate(500);
    Alert.alert(
      "Victoire !", 
      `Le joueur ${winner === 'P1' ? '1 (Orange)' : '2 (Bleu)'} a gagné !`,
      [{ text: "Rejouer", onPress: resetGame }]
    );
  };

  const handleCellPress = (index) => {
    // Empêcher de jouer si c'est le tour de l'IA
    if (vsAI && gameState.currentPlayer === PLAYERS.P2) return;

    const currentPlayer = gameState.currentPlayer;
    const selected = gameState.selected;

    // Sélectionner un pion
    if (selected === null) {
      if (gameState.board[index] === currentPlayer) {
        setGameState(prev => new GameState(
          prev.board,
          prev.currentPlayer,
          prev.phase,
          index
        ));
      }
      return;
    }

    // Désélectionner
    if (selected === index) {
      setGameState(prev => new GameState(
        prev.board,
        prev.currentPlayer,
        prev.phase,
        null
      ));
      return;
    }

    // Vérifier si le mouvement est valide
    if (isValidMove(gameState.board, selected, index)) {
      const result = executeMove(gameState, index, selected, currentPlayer);
      
      const winner = result.winner;
      setGameState(prev => new GameState(
        result.board,
        result.nextPlayer,
        prev.phase,
        result.selected
      ));

      if (winner) {
        handleGameEnd(winner);
      }
    } else {
      // Si on clique sur un autre pion du même joueur, le sélectionner
      if (gameState.board[index] === currentPlayer) {
        setGameState(prev => new GameState(
          prev.board,
          prev.currentPlayer,
          prev.phase,
          index
        ));
      }
    }
  };

  const resetGame = () => {
    setGameState(new GameState());
  };

  return (
    <View style={styles.container}>
      <FanoronaTeloComponent
        board={gameState.board}
        currentPlayer={gameState.currentPlayer}
        phase={gameState.phase}
        selected={gameState.selected}
        vsAI={vsAI}
        onCellPress={handleCellPress}
      />

      <TouchableOpacity style={styles.resetBtn} onPress={resetGame}>
        <Text style={styles.resetText}>Nouvelle Partie</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06141d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtn: { 
    marginTop: 60, 
    paddingVertical: 12, 
    paddingHorizontal: 30, 
    backgroundColor: '#123040', 
    borderRadius: 25 
  },
  resetText: { 
    color: '#e6f1f8', 
    fontSize: 18, 
    fontWeight: 'bold' 
  }
});