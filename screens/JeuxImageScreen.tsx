import { useEffect, useState } from "react";
import JeuxImageComponent from "../components/JeuxImage";

const EMOJIS = [
  '🍎','🍌','🍇','🍉','🍓','🍒','🥝','🍍','🥥','🍑',
  '🍔','🍕','🌭','🍟','🍿','🥪','🍩','🍪','🎂','🍫',
  '⚽','🏀','🏈','🎾','🏐','🎮','🎲','🧩','🎯','🎹',
  '🐶','🐱','🐭','🐰','🦊','🐻','🐼','🐸','🦁','🐯',
  '🚗','🚕','✈️','🚀','🚲','🚢','🚁','🚂','🛸','🚜'
];

export default function JeuxImageScreen() {
  const [photo, setPhoto] = useState([]);
  const [temps, setTemps] = useState(60);
  const [tempsActive, setTempsActive] = useState(5);
  const [active, setActive] = useState(true);
  const [choix, setChoix] = useState('');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const initGame = () => {
    const shuffled = [...EMOJIS].sort(() => 0.5 - Math.random());
    setPhoto(shuffled.slice(0, 25));
    setChoix(shuffled[Math.floor(Math.random() * shuffled.length)]);
    setTemps(60);
    setTempsActive(5);
    setScore(0);
    setActive(true);
    setGameOver(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  // ⏱ TIMER GLOBAL
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setTemps(t => {
        if (t <= 1) {
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });

      setTempsActive(t => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver]);

  // 🔄 SWITCH PHASE
  useEffect(() => {
    if (tempsActive <= 0 && !gameOver) {
      setActive(false);
      setTempsActive(5);
      setChoix(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
    }
  }, [tempsActive]);

  const estDansLaList = (rep) => {
    const existe = photo.includes(choix);
    const isCorrect = (rep === 'oui' && existe) || (rep === 'non' && !existe);

    setFeedback(isCorrect ? '✅' : '❌');

    if (isCorrect) setScore(s => s + 1);
    else setScore(s => s - 1);

    setTimeout(() => {
      setFeedback(null);
      setChoix(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
    }, 500);
  };

  const handleAnswer = (answer) => {
    estDansLaList(answer);
  };

  const handleReplay = () => {
    initGame();
  };

  return (
    <JeuxImageComponent
      photo={photo}
      temps={temps}
      score={score}
      active={active}
      choix={choix}
      gameOver={gameOver}
      feedback={feedback}
      onAnswer={handleAnswer}
      onReplay={handleReplay}
    />
  );
}