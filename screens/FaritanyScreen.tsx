import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FaritanyComponent from '../components/Faritany';

const INITIAL_GRID = 8;

export default function FaritanyScreen() {
  const [gridSize, setGridSize] = useState(INITIAL_GRID);
  const [points, setPoints] = useState({});
  const [captures, setCaptures] = useState([]);
  const [capturedKeys, setCapturedKeys] = useState(new Set());
  const [turn, setTurn] = useState('red');
  const [scores, setScores] = useState({ red: 0, blue: 0 });
  const [gameMode, setGameMode] = useState(null);
  const [scale, setScale] = useState(1);

  // --- Fonctions de jeu (logique métier) ---
  const findCycle = (startKey, currentPoints, playerColor) => {
    const visited = new Set();
    const find = (curr, parent, path) => {
      visited.add(curr);
      const [r, c] = curr.split('-').map(Number);
      const neighbors = [
        `${r - 1}-${c}`, `${r + 1}-${c}`, `${r}-${c - 1}`, `${r}-${c + 1}`,
        // `${r - 1}-${c - 1}`, `${r - 1}-${c + 1}`, `${r + 1}-${c - 1}`, `${r + 1}-${c + 1}`
      ];
      for (let n of neighbors) {
        if (currentPoints[n] === playerColor) {
          if (n === startKey && path.length >= 3) return [...path, startKey];
          if (!visited.has(n)) {
            const res = find(n, curr, [...path, n]);
            if (res) return res;
          }
        }
      }
      return null;
    };
    return find(startKey, null, [startKey]);
  };

  const isInside = (pointKey, polygonPath) => {
    const [pr, pc] = pointKey.split('-').map(Number);
    const poly = polygonPath.map(k => k.split('-').map(Number));
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      const intersect = ((yi > pc) !== (yj > pc)) && (pr < (xj - xi) * (pc - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const hasOpponentInside = (path, currentPoints, playerColor) => {
    const opponent = playerColor === 'red' ? 'blue' : 'red';
    return Object.keys(currentPoints).some(k => currentPoints[k] === opponent && isInside(k, path));
  };

  const resetData = () => {
    setPoints({});
    setCaptures([]);
    setCapturedKeys(new Set());
    setScores({ red: 0, blue: 0 });
    setTurn('red');
    setGridSize(INITIAL_GRID);
    setScale(1);
  };

  const handleCellPress = (row, col) => {
    const key = `${row}-${col}`;
    if (points[key] || capturedKeys.has(key)) return;

    let newPoints = { ...points, [key]: turn };
    const cyclePath = findCycle(key, newPoints, turn);

    if (cyclePath) {
      const opponentColor = turn === 'red' ? 'blue' : 'red';
      const newlyCaptured = Object.keys(newPoints).filter(pk =>
        newPoints[pk] === opponentColor && isInside(pk, cyclePath) && !capturedKeys.has(pk)
      );

      if (newlyCaptured.length > 0) {
        setCaptures(prev => [...prev, { path: cyclePath, color: turn }]);

        newlyCaptured.forEach(pk => {
          newPoints[pk] = '#111';
        });

        const updatedCaptured = new Set([...capturedKeys, ...newlyCaptured]);
        setCapturedKeys(updatedCaptured);
        setScores(prev => ({
          ...prev,
          [turn]: prev[turn] + newlyCaptured.length,
          [opponentColor]: Math.max(0, prev[opponentColor] - newlyCaptured.length)
        }));
      }
    }

    setPoints(newPoints);

    // Vérification de fin de partie
    if (Object.keys(newPoints).length + capturedKeys.size >= gridSize * gridSize - 2) {
      if (scores.red === scores.blue) {
        setGridSize(g => g + 4);
      } else {
        const winColor = scores.red > scores.blue ? "Rouge" : "Bleu";
        resetData();
        Alert.alert("Fin", `${winColor} Gagne`, [
          { text: "Menu", onPress: () => setGameMode(null) }
        ]);
      }
    }
    setTurn(turn === 'red' ? 'blue' : 'red');
  };

  // --- IA ---
  const makeAdvancedAIMove = () => {
    const available = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const k = `${r}-${c}`;
        if (!points[k] && !capturedKeys.has(k)) available.push(k);
      }
    }
    if (available.length === 0) return;

    // 1. Chercher un coup gagnant
    for (let move of available) {
      const testP = { ...points, [move]: 'blue' };
      const path = findCycle(move, testP, 'blue');
      if (path && hasOpponentInside(path, testP, 'blue')) {
        handleCellPress(...move.split('-').map(Number));
        return;
      }
    }

    // 2. Bloquer l'humain
    for (let move of available) {
      const testP = { ...points, [move]: 'red' };
      const path = findCycle(move, testP, 'red');
      if (path && hasOpponentInside(path, testP, 'red')) {
        handleCellPress(...move.split('-').map(Number));
        return;
      }
    }

    // 3. Placement stratégique
    const scored = available.map(m => {
      let s = 0;
      const [r, c] = m.split('-').map(Number);
      const neighbors = [`${r - 1}-${c}`, `${r + 1}-${c}`, `${r}-${c - 1}`, `${r}-${c + 1}`];
      neighbors.forEach(n => { if (points[n] === 'blue') s += 10; });
      return { m, s: s - (Math.abs(r - gridSize / 2) + Math.abs(c - gridSize / 2)) };
    }).sort((a, b) => b.s - a.s);

    handleCellPress(...scored[0].m.split('-').map(Number));
  };

  useEffect(() => {
    if (gameMode === 'IA' && turn === 'blue') {
      const timer = setTimeout(makeAdvancedAIMove, 600);
      return () => clearTimeout(timer);
    }
  }, [turn, gameMode]);

  // --- Menu UI ---
  if (!gameMode) {
    return (
      <View style={styles.menu}>
        <Text style={styles.menuTitle}>Jeux de Faritany</Text>
        <TouchableOpacity style={styles.menuBtn} onPress={() => {
          setGameMode('2P');
          resetData();
        }}>
          <Text style={styles.btnText}>2 JOUEURS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuBtn, { backgroundColor: '#444' }]} onPress={() => {
          setGameMode('IA');
          resetData();
        }}>
          <Text style={styles.btnText}>CONTRE L'IA (EXPERT)</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FaritanyComponent
      gameMode={gameMode}
      gridSize={gridSize}
      points={points}
      captures={captures}
      capturedKeys={capturedKeys}
      turn={turn}
      scores={scores}
      scale={scale}
      onCellPress={handleCellPress}
      onMenuPress={() => setGameMode(null)}
      onZoomIn={() => setScale(s => Math.min(s + 0.2, 2))}
      onZoomOut={() => setScale(s => Math.max(s - 0.2, 0.5))}
    />
  );
}

const styles = StyleSheet.create({
  menu: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#06141d' },
  menuTitle: { textAlign: 'center', fontSize: 40, color: '#FFF', fontWeight: 'bold', marginBottom: 40, letterSpacing: 5 },
  menuBtn: { backgroundColor: 'red', padding: 20, borderRadius: 15, width: 250, marginBottom: 20, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' }
});