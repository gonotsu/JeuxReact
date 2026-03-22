import { useState } from "react";
import { Alert, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Polyline, Rect, Text as SvgText } from "react-native-svg";

const { width } = Dimensions.get("window");
const GRID_SIZE = 12; // 12x12
const CELL_SIZE = Math.floor((width - 40) / GRID_SIZE);
const BOARD_SIZE = GRID_SIZE * CELL_SIZE;

export default function ConnectPointsComponent({
  placedPoints,
  paths,
  isSolved,
  remainingPairs,
  onPlacePoint,
  onReset,
  onSolve,
}) {
  const [gameOver, setGameOver] = useState(false);

  const handleGridPress = event => {
    if (isSolved || gameOver) return;

    const { locationX, locationY } = event.nativeEvent;
    const x = Math.floor(locationX / CELL_SIZE);
    const y = Math.floor(locationY / CELL_SIZE);

    onPlacePoint({ x, y });
  };

  const handleSolve = () => {
    const message = onSolve();
    if (message) Alert.alert("Erreur", message);
    else setGameOver(true);
  };

  const handleReset = () => {
    onReset();
    setGameOver(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>EMOJI ROUTER 🧩</Text>
      <Text style={styles.infoText}>
        Paires restantes: {remainingPairs}
      </Text>

      <View style={styles.boardContainer}>
        <Svg
          height={BOARD_SIZE}
          width={BOARD_SIZE}
          onPress={handleGridPress}
          style={styles.svgBoard}
        >
          {/* Grille */}
          {[...Array(GRID_SIZE)].map((_, i) =>
            [...Array(GRID_SIZE)].map((_, j) => (
              <Rect
                key={`${i}-${j}`}
                x={i * CELL_SIZE}
                y={j * CELL_SIZE}
                width={CELL_SIZE}
                height={CELL_SIZE}
                fill="transparent"
                stroke="#334155"
                strokeWidth="0.5"
              />
            ))
          )}

          {/* Chemins */}
          {paths.map((path, i) => (
            <Polyline
              key={i}
              points={path.points
                .map(
                  p => `${p.x * CELL_SIZE + CELL_SIZE / 2},${p.y * CELL_SIZE + CELL_SIZE / 2}`
                )
                .join(" ")}
              fill="none"
              stroke="#FACC15"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Points (Emojis) */}
          {placedPoints.map((p, i) => (
            <SvgText
              key={i}
              x={p.position.x * CELL_SIZE + CELL_SIZE / 2}
              y={p.position.y * CELL_SIZE + CELL_SIZE / 1.4}
              fontSize={CELL_SIZE * 0.7}
              textAnchor="middle"
            >
              {p.emoji}
            </SvgText>
          ))}
        </Svg>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.resetBtn]} onPress={handleReset}>
          <Text style={styles.buttonText}>Rejouer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.solveBtn, (isSolved || gameOver) && styles.disabledBtn]}
          onPress={handleSolve}
          disabled={isSolved || gameOver}
        >
          <Text style={styles.buttonText}>Résoudre</Text>
        </TouchableOpacity>
      </View>

      {gameOver && (
        <Text style={styles.gameOverText}>
          Partie terminée !
        </Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A", alignItems: "center", paddingTop: 20 },
  title: { fontSize: 28, fontWeight: "900", color: "#38BDF8", marginBottom: 10 },
  infoText: { color: "#F8FAFC", fontSize: 16, marginBottom: 10 },
  boardContainer: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 5,
    borderWidth: 2,
    borderColor: "#334155",
    overflow: "hidden",
  },
  svgBoard: { borderRadius: 8 },
  buttonRow: { flexDirection: "row", marginTop: 20, gap: 15 },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    elevation: 3,
  },
  resetBtn: { backgroundColor: "#EF4444" },
  solveBtn: { backgroundColor: "#10B981" },
  disabledBtn: { backgroundColor: "#334155" },
  buttonText: { color: "#F8FAFC", fontWeight: "700", fontSize: 16 },
  gameOverText: { color: "#FACC15", fontSize: 22, fontWeight: "bold", marginTop: 20 },
});