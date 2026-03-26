# Collection de Jeux React Native
Une collection de mini-jeux développés avec React Native,


## Jeux Disponibles

### 1. Faritany
Jeu de stratégie territoriale où le but est d'encercler et capturer les points adverses.

**Fonctionnalités :**
- Plateau de jeu avec points positionnés
- Mécanique d'encerclement : entourez les points adverses avec vos points pour les capturer
- Mode 2 joueurs ou contre l'IA
- Système de score et progression
- Animations de capture

**Objectif :** Encercler les points adverses avec vos propres points pour les capturer et dominer le territoire.

### 2. EMOJI ROUTER
Jeu de connexion où le joueur place des paires d'emojis et le programme trouve automatiquement le chemin pour les relier.

**Fonctionnalités :**
- Grille 12x12
- Placement de paires d'emojis par tap
- Algorithme de recherche de chemin automatique
- Calcul des connexions entre les paires
- Résolution automatique possible

**Objectif :** Placer les paires d'emojis, le programme calcule et affiche les chemins qui les relient.

### 3.Fanorona Sivy
Version avancée du Fanorona sur une grille 5x5 avec captures multiples.

**Fonctionnalités :**
- Plateau 9x5
- Mécanique de captures (approche/retrait)
- IA avec stratégie minimax
- Mode 2 joueurs

### 4. Fanorona Telo
Version simplifiée du Fanorona sur une grille 3x3.

**Fonctionnalités :**
- Plateau 3x3
- Phase de placement et de mouvement
- Mode 2 joueurs ou contre l'IA

### 5.Couleur Match
Jeu de mémoire où le joueur doit sélectionner 4 cellules de la même couleur.

### 6.Number Puzzle
Puzzle numérique avec rotations de blocs 2x2.

### 7. Emoji Memory
Jeu de mémoire où le joueur doit deviner si un emoji est présent dans la grille.

## Architecture
src/
├── domain/ # Modèles et constantes
├── usecases/ # Logique métier pure
├── components/ # Composants UI
├── screens/ # Écrans avec état
└── App/index.tsx # Point d'entrée


## Installation

```bash
# Cloner le dépôt
git clone https://github.com/gonotsu/JeuxReact.git

# Installer les dépendances
npm install

# Lancer l'application
npm start
npm run ios    # Pour iOS
npm run android # Pour Android
