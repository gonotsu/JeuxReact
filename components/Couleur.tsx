import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const CELL_SIZE = 42;

export default function CouleurComponent({
  grid,
  selected,
  score,
  onCellPress,
}) {
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>🎨 Couleur Match</Text>
        <Text style={styles.score}>Score : {score}</Text>
      </View>

      {/* GRID */}
      <View style={styles.grid}>
        {grid.cells.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map(cell => {
              const isSelected = selected.includes(cell);

              return (
                <TouchableOpacity
                  key={`${cell.row}-${cell.col}`}
                  onPress={() => onCellPress(cell)}
                  activeOpacity={0.8}
                  style={[
                    styles.cell,
                    {
                      backgroundColor: cell.color,
                      transform: [{ scale: isSelected ? 1.1 : 1 }],
                    },
                    isSelected && styles.selectedCell,
                  ]}
                />
              );
            })}
          </View>
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

  header: {
    position: 'absolute',
    top: 50,
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e6f1f8',
    marginBottom: 5,
  },

  score: {
    fontSize: 18,
    color: '#00bcd4',
    fontWeight: '600',
  },

  grid: {
    backgroundColor: '#0b1f2a',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#123040',
  },

  row: {
    flexDirection: 'row',
  },

  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    margin: 3,
    borderRadius: 8,
    elevation: 4,
  },

  selectedCell: {
    borderWidth: 2,
    borderColor: '#00e5ff',
    shadowColor: '#00e5ff',
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
});