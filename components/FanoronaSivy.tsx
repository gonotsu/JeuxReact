import React, { useMemo } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { COLS, ROWS } from '../domain/fanorona';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

export default function FanoronaSivyComponent({
  board,
  currentPlayer,
  selectedPiece,
  validMoves,
  isAIThinking,
  mode,
  onModeSelect,
  onReset,
  onSelectPiece,
  onMakeMove,
}) {
  const padding = 20;
  const boardWidth = Math.max(windowWidth * 0.6, windowHeight - 100);
  const cellWidth = boardWidth / (COLS - 1);
  const cellHeight = cellWidth;
  const boardHeight = (ROWS - 1) * cellHeight + padding * 2;

  const getPosition = (row, col) => ({
    x: padding + col * cellWidth,
    y: padding + row * cellHeight,
  });

  const renderLines = useMemo(() => {
    const lines = [];

    for (let row = 0; row < ROWS; row++) {
      const start = getPosition(row, 0);
      const end = getPosition(row, COLS - 1);
      lines.push(
        <Line key={`h-${row}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#8B7355" strokeWidth="2" />
      );
    }

    for (let col = 0; col < COLS; col++) {
      const start = getPosition(0, col);
      const end = getPosition(ROWS - 1, col);
      lines.push(
        <Line key={`v-${col}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#8B7355" strokeWidth="2" />
      );
    }

    for (let row = 0; row < ROWS - 1; row++) {
      for (let col = 0; col < COLS - 1; col++) {
        const hasDiagonals = (row + col) % 2 === 0;
        if (hasDiagonals) {
          const pos1 = getPosition(row, col);
          const pos2 = getPosition(row + 1, col + 1);
          lines.push(
            <Line key={`d1-${row}-${col}`} x1={pos1.x} y1={pos1.y} x2={pos2.x} y2={pos2.y} stroke="#8B7355" strokeWidth="2" />
          );
        }
        const hasDiagonalsNext = ((row + (col + 1)) % 2 === 0);
        if (hasDiagonalsNext) {
          const pos1 = getPosition(row, col + 1);
          const pos2 = getPosition(row + 1, col);
          lines.push(
            <Line key={`d2-${row}-${col}`} x1={pos1.x} y1={pos1.y} x2={pos2.x} y2={pos2.y} stroke="#8B7355" strokeWidth="2" />
          );
        }
      }
    }

    return lines;
  }, [cellHeight, cellWidth]);

  const renderValidMoves = useMemo(() => {
    return validMoves.map((move, index) => {
      const pos = getPosition(move.row, move.col);
      const hasApproach = move.captures.approach.length > 0;
      const hasWithdrawal = move.captures.withdrawal.length > 0;

      if (hasApproach && hasWithdrawal) {
        const offset = cellWidth * 0.08;
        return (
          <React.Fragment key={`valid-${index}`}>
            <Circle
              cx={pos.x}
              cy={pos.y - offset}
              r={cellWidth * 0.12}
              fill="#4CAF50"
              opacity={0.8}
              stroke="#FFF"
              strokeWidth={2}
            />
            <Circle
              cx={pos.x}
              cy={pos.y + offset}
              r={cellWidth * 0.12}
              fill="#FF9800"
              opacity={0.8}
              stroke="#FFF"
              strokeWidth={2}
            />
          </React.Fragment>
        );
      }

      return (
        <Circle
          key={`valid-${index}`}
          cx={pos.x}
          cy={pos.y}
          r={cellWidth * 0.15}
          fill={hasApproach || hasWithdrawal ? '#4CAF50' : '#2196F3'}
          opacity={0.7}
        />
      );
    });
  }, [validMoves, cellWidth]);

  const renderPieces = useMemo(() => {
    const pieces = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const pos = getPosition(row, col);
        const piece = board[row][col];
        if (piece !== 0) {
          const isSelected = selectedPiece?.row === row && selectedPiece?.col === col;
          const color = piece === 1 ? '#FF6B35' : '#4A4A4A';
          pieces.push(
            <Circle
              key={`piece-${row}-${col}`}
              cx={pos.x}
              cy={pos.y}
              r={cellWidth * 0.18}
              fill={color}
              stroke={isSelected ? '#FFD700' : '#FFF'}
              strokeWidth={isSelected ? 3 : 1}
            />
          );
        }
      }
    }
    return pieces;
  }, [board, cellWidth, selectedPiece]);

  const renderTouchableAreas = useMemo(() => {
    const areas = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const pos = getPosition(row, col);
        const move = validMoves.find(m => m.row === row && m.col === col);
        const baseStyle = {
          left: pos.x - cellWidth * 0.25,
          top: pos.y - cellHeight * 0.25,
          width: cellWidth * 0.5,
          height: cellHeight * 0.5,
        };

        if (move) {
          const hasApproach = move.captures.approach.length > 0;
          const hasWithdrawal = move.captures.withdrawal.length > 0;

          if (hasApproach && hasWithdrawal) {
            const offset = cellWidth * 0.08;
            areas.push(
              <TouchableOpacity
                key={`touch-approach-${row}-${col}`}
                style={[styles.touchArea, { ...baseStyle, top: baseStyle.top - offset }]}
                onPress={() => onMakeMove(move, 'approach')}
                activeOpacity={0.7}
              />
            );
            areas.push(
              <TouchableOpacity
                key={`touch-withdrawal-${row}-${col}`}
                style={[styles.touchArea, { ...baseStyle, top: baseStyle.top + offset }]}
                onPress={() => onMakeMove(move, 'withdrawal')}
                activeOpacity={0.7}
              />
            );
            continue;
          }

          areas.push(
            <TouchableOpacity
              key={`touch-move-${row}-${col}`}
              style={[styles.touchArea, baseStyle]}
              onPress={() => onMakeMove(move)}
              activeOpacity={0.7}
            />
          );
          continue;
        }

        areas.push(
          <TouchableOpacity
            key={`touch-${row}-${col}`}
            style={[styles.touchArea, baseStyle]}
            onPress={() => onSelectPiece(row, col)}
            activeOpacity={0.7}
          />
        );
      }
    }
    return areas;
  }, [cellHeight, cellWidth, onMakeMove, onSelectPiece, validMoves]);

  if (!mode) {
    return (
      <View style={styles.menu}>
        <Text style={styles.menuTitle}>Fanorona Sivy</Text>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => onModeSelect('2P')}
        >
          <Text style={styles.btnText}>2 JOUEURS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuBtn, { backgroundColor: '#4A4A4A' }]}
          onPress={() => onModeSelect('IA')}
        >
          <Text style={styles.btnText}>CONTRE L'IA</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftPanel}>
        <Text style={styles.title}>Fanorona Sivy</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.turnText}>
            {currentPlayer === 1 ? 'Votre tour' : "Tour de l'IA"}
          </Text>
          {isAIThinking && (
            <ActivityIndicator size="small" color="#FF6B35" style={styles.aiIndicator} />
          )}
        </View>
      </View>

      <View style={styles.rightPanel}>
        <View style={[styles.board, { width: boardWidth + padding * 2, height: boardHeight }]}>
          <Svg width={boardWidth + padding * 2} height={boardHeight} style={styles.svg}>
            {renderLines}
            {renderValidMoves}
            {renderPieces}
          </Svg>
          {renderTouchableAreas}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#06141d',
    alignItems: 'center',
  },

  leftPanel: {
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  rightPanel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e6f1f8',
    textAlign: 'center',
    width: Dimensions.get('window').width,
  },

  statusContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },

  turnText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#00bcd4',
    textAlign: 'center',
    marginBottom: 5,
  },

  aiIndicator: {
    marginTop: 5,
  },

  board: {
    backgroundColor: '#0b1f2a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#123040',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  svg: {
    position: 'absolute',
  },

  touchArea: {
    position: 'absolute',
  },

  menu: {
    flex: 1,
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#06141d',
  },

  menuTitle: {
    fontSize: 48,
    color: '#e6f1f8',
    fontWeight: 'bold',
    marginBottom: 60,
    letterSpacing: 3,
    textAlign: 'center',
  },

  menuBtn: {
    backgroundColor: '#123040',
    padding: 20,
    borderRadius: 15,
    width: 300,
    marginBottom: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00bcd4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 8,
  },

  btnText: {
    color: '#e6f1f8',
    fontWeight: 'bold',
    fontSize: 18,
  },
});