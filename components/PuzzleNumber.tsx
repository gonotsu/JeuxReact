import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { isCellInSelectedArea } from '../usecases/puzzleNumber';

export default function NumberPuzzleComponent({
  grid,
  selectedRow,
  selectedCol,
  onCellPress,
  onMoveLeft,
  onMoveRight,
}) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.level}>LEVEL 1</Text>

      {/* GRID */}
      <View style={styles.grid}>
        {grid.map((rowData, r) =>
          rowData.map((value, c) => {
            const isSelected = isCellInSelectedArea(r, c, selectedRow, selectedCol);

            return (
              <TouchableOpacity
                key={`${r}-${c}`}
                onPress={() => onCellPress(r, c)}
                style={[
                  styles.cell,
                  isSelected && styles.selectedCell,
                ]}
              >
                <Text style={styles.cellText}>{value}</Text>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      {/* CONTROLS */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={onMoveLeft}>
          <Text style={styles.arrow}>◀</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onMoveRight}>
          <Text style={styles.arrow}>▶</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#06141d",
    alignItems: "center",
  },
  level: {
    color: "#4ff3ff",
    fontSize: 22,
    marginVertical: 20,
    letterSpacing: 2,
  },
  grid: {
    width: 320,
    height: 320,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: 'center',
    justifyContent: 'center'
  },
  cell: {
    width: "25%",
    height: "25%",
    borderWidth: 1,
    borderColor: "#2c3e50",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0b1f2a",
  },
  selectedCell: {
    borderColor: "#4ff3ff",
    borderWidth: 2,
  },
  cellText: {
    color: "#ffffff",
    fontSize: 22,
  },
  controls: {
    flexDirection: "row",
    marginTop: 40,
    gap: 40,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#4ff3ff",
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    color: "#4ff3ff",
    fontSize: 28,
  },
});