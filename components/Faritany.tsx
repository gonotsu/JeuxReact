import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

const CELL_SIZE = 40;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function FaritanyComponent({
  gameMode,
  gridSize,
  points,
  captures,
  capturedKeys,
  turn,
  scores,
  scale,
  onCellPress,
  onMenuPress,
  onZoomIn,
  onZoomOut,
}) {
  if (!gameMode) {
    return null; // Le menu est géré par la page
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.pBox, turn === 'red' && { borderColor: 'red', borderBottomWidth: 3 }]}>
          <Text style={{ color: 'red', fontWeight: 'bold' }}>ROUGE: {scores.red}</Text>
        </View>
        <TouchableOpacity onPress={onMenuPress}>
          <Text style={{ color: '#666' }}>MENU</Text>
        </TouchableOpacity>
        <View style={[styles.pBox, turn === 'blue' && { borderColor: 'blue', borderBottomWidth: 3 }]}>
          <Text style={{ color: 'blue', fontWeight: 'bold' }}>BLEU: {scores.blue}</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.center} 
        maximumZoomScale={3} 
        minimumZoomScale={0.5}
      >
        <ScrollView contentContainerStyle={styles.center}>
          <View style={[styles.grid, { flex: 1, width: SCREEN_WIDTH, transform: [{ scale }] }]}>
            {Array.from({ length: gridSize }).map((_, r) => (
              <View key={r} style={{ flexDirection: 'row' }}>
                {Array.from({ length: gridSize }).map((_, c) => {
                  const k = `${r}-${c}`;
                  const isCap = capturedKeys.has(k);
                  const color = points[k];
                  return (
                    <TouchableOpacity 
                      key={k} 
                      onPress={() => onCellPress(r, c)} 
                      style={styles.cell} 
                      disabled={isCap}
                    >
                      <View style={[
                        styles.dot, 
                        { backgroundColor: color || '#333' },
                        isCap && { width: 8, height: 8, backgroundColor: '#06141d', borderWidth: 1, borderColor: '#444' },
                        color && !isCap && { width: 14, height: 14, borderRadius: 7 }
                      ]} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
            <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
              {captures.map((cap, i) => (
                <Polyline 
                  key={i} 
                  points={cap.path.map(k => 
                    `${k.split('-')[1] * CELL_SIZE + CELL_SIZE / 2},${k.split('-')[0] * CELL_SIZE + CELL_SIZE / 2}`
                  ).join(' ')} 
                  fill={cap.color === 'red' ? 'rgba(255,0,0,0.1)' : 'rgba(0,0,255,0.1)'} 
                  stroke={cap.color} 
                  strokeWidth="2" 
                />
              ))}
            </Svg>
          </View>
        </ScrollView>
      </ScrollView>

      <View style={styles.zoomBar}>
        <TouchableOpacity style={styles.zBtn} onPress={onZoomIn}>
          <Text style={styles.zText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zBtn} onPress={onZoomOut}>
          <Text style={styles.zText}>-</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: SCREEN_WIDTH, backgroundColor: '#06141d' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#06141a' },
  pBox: { padding: 8, backgroundColor: '#1a1a1a', borderRadius: 8, width: 100, alignItems: 'center' },
  center: { alignItems: 'center', justifyContent: 'center' },
  grid: { backgroundColor: '#06141d', borderWidth: 1, borderColor: '#222' },
  cell: { width: CELL_SIZE, height: CELL_SIZE, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3 },
  zoomBar: { position: 'absolute', bottom: 30, right: 20, flexDirection: 'row', gap: 10 },
  zBtn: { width: 45, height: 45, borderRadius: 22, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333' },
  zText: { color: '#FFF', fontSize: 20 }
});