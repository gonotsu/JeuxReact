import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width * 0.8;

const getPointPos = (i) => ({
  left: (i % 3) * (BOARD_SIZE / 2) - 20,
  top: Math.floor(i / 3) * (BOARD_SIZE / 2) - 20,
});

export default function FanoronaTeloComponent({
  board,
  currentPlayer,
  phase,
  selected,
  vsAI,
  onCellPress,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fanorona Telo</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {phase === 'PLACEMENT' ? 'Phase : Pose' : 'Phase : Mouvement'}
        </Text>
        <Text style={[styles.turnText, { color: currentPlayer === 'P1' ? '#E67E22' : '#3498DB' }]}>
          est au tour du {currentPlayer === 'P1' ? 'Joueur 1' : `Joueur 2${vsAI ? ' (IA)' : ''}`}
        </Text>
      </View>

      <View style={styles.board}>
        {/* Lignes du plateau */}
        <View style={styles.lineH} />
        <View style={[styles.lineH, { top: BOARD_SIZE / 2 }]} />
        <View style={[styles.lineH, { top: BOARD_SIZE }]} />
        <View style={styles.lineV} />
        <View style={[styles.lineV, { left: BOARD_SIZE / 2 }]} />
        <View style={[styles.lineV, { left: BOARD_SIZE }]} />
        <View style={styles.lineD1} />
        <View style={styles.lineD2} />

        {/* Points d'intersection et Pions */}
        {board.map((cell, i) => (
          <TouchableOpacity 
            key={i} 
            activeOpacity={0.8}
            style={[styles.point, getPointPos(i), selected === i && styles.selectedPoint]} 
            onPress={() => onCellPress(i)}
          >
            {cell && <View style={[styles.piece, cell === 'P1' ? styles.pieceP1 : styles.pieceP2]} />}
          </TouchableOpacity>
        ))}
      </View>
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

  title: { 
    fontSize: 36, 
    fontWeight: 'bold', 
    color: '#e6f1f8', 
    marginBottom: 20 
  },

  statusContainer: { 
    alignItems: 'center', 
    marginBottom: 40 
  },

  statusText: { 
    fontSize: 18, 
    color: '#7fa3b8' 
  },

  turnText: { 
    fontSize: 22, 
    fontWeight: 'bold' 
  },
  
  board: { 
    width: BOARD_SIZE, 
    height: BOARD_SIZE, 
    position: 'relative' 
  },

  lineH: { 
    position: 'absolute', 
    width: BOARD_SIZE, 
    height: 3, 
    backgroundColor: '#123040' 
  },

  lineV: { 
    position: 'absolute', 
    width: 3, 
    height: BOARD_SIZE, 
    backgroundColor: '#123040' 
  },

  lineD1: { 
    position: 'absolute', 
    width: BOARD_SIZE * 1.41, 
    height: 3, 
    backgroundColor: '#123040', 
    transform: [{ rotate: '45deg' }], 
    top: BOARD_SIZE / 2, 
    left: -BOARD_SIZE * 0.205 
  },

  lineD2: { 
    position: 'absolute', 
    width: BOARD_SIZE * 1.41, 
    height: 3, 
    backgroundColor: '#123040', 
    transform: [{ rotate: '-45deg' }], 
    top: BOARD_SIZE / 2, 
    left: -BOARD_SIZE * 0.205 
  },
  
  point: { 
    position: 'absolute', 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#0b1f2a', 
    borderWidth: 2, 
    borderColor: '#123040', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 10 
  },

  selectedPoint: { 
    borderColor: '#00e5ff', 
    borderWidth: 4 
  },
  
  piece: { 
    width: 30, 
    height: 30, 
    borderRadius: 15, 
    elevation: 6, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.5, 
    shadowRadius: 4 
  },

  pieceP1: { backgroundColor: '#00bcd4' }, 
  pieceP2: { backgroundColor: '#4f5789' },
});