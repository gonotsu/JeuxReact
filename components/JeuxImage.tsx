import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function JeuxImageComponent({
  photo,
  temps,
  score,
  active,
  choix,
  gameOver,
  feedback,
  onAnswer,
  onReplay,
}) {
  // 🎮 GAME OVER SCREEN
  if (gameOver) {
    return (
      <View style={styles.container}>
        <Text style={styles.gameOver}>💀 Game Over</Text>
        <Text style={styles.finalScore}>Score final : {score}</Text>

        <TouchableOpacity style={styles.btnReplay} onPress={onReplay}>
          <Text style={styles.btnText}>🔄 Rejouer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>🧠 Emoji Memory</Text>
        <Text style={styles.timer}>⏱ {temps}s</Text>
        <Text style={styles.score}>Score : {score}</Text>
      </View>

      {/* GRID */}
      {active && (
        <View style={styles.grid}>
          {photo.map((cell, id) => (
            <View key={id} style={styles.cell}>
              <Text style={styles.emoji}>{cell}</Text>
            </View>
          ))}
        </View>
      )}

      {/* QUESTION */}
      {!active && (
        <View style={styles.questionBox}>
          {feedback && <Text style={{ fontSize: 40 }}>{feedback}</Text>}
          <Text style={styles.bigEmoji}>{choix}</Text>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.btn, styles.btnYes]}
              onPress={() => onAnswer('oui')}
            >
              <Text style={styles.btnText}>✔ OUI</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnNo]}
              onPress={() => onAnswer('non')}
            >
              <Text style={styles.btnText}>✖ NON</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    color: '#e6f1f8',
    fontWeight: 'bold',
  },

  timer: {
    fontSize: 20,
    color: '#00bcd4',
  },

  score: {
    fontSize: 18,
    color: '#4fc3f7',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 260,
    justifyContent: 'center',
    backgroundColor: '#0b1f2a',
    padding: 10,
    borderRadius: 12,
  },

  cell: {
    width: 42,
    height: 42,
    margin: 4,
    borderRadius: 10,
    backgroundColor: '#123040',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emoji: {
    fontSize: 20,
  },

  questionBox: {
    alignItems: 'center',
  },

  bigEmoji: {
    fontSize: 80,
    marginBottom: 30,
  },

  btnRow: {
    flexDirection: 'row',
  },

  btn: {
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 10,
  },

  btnYes: {
    backgroundColor: '#00bcd4',
  },

  btnNo: {
    backgroundColor: '#ff5252',
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  gameOver: {
    fontSize: 40,
    color: '#ff5252',
    fontWeight: 'bold',
    marginBottom: 20,
  },

  finalScore: {
    fontSize: 24,
    color: '#e6f1f8',
    marginBottom: 30,
  },

  btnReplay: {
    backgroundColor: '#00bcd4',
    padding: 15,
    borderRadius: 12,
  },
});