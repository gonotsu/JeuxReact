import React, { useState } from 'react';
import CouleurComponent from '../components/Couleur';
import { Grid as GridModel } from '../domain/grid';
import { handleSelection } from '../usecases/selectCells';

export default function CouleurScreen() {
  const [grid, setGrid] = useState(new GridModel(8));
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);

  const onCellPress = (cell) => {
    if (selected.includes(cell)) return;

    const newSelection = [...selected, cell];
    setSelected(newSelection);

    if (newSelection.length === 4) {
      const { score: newScore, updatedGrid } = handleSelection(newSelection, grid);
      setScore(prev => prev + newScore);
      setGrid(updatedGrid);
      setSelected([]);
    }
  };

  return (
    <CouleurComponent
      grid={grid}
      selected={selected}
      score={score}
      onCellPress={onCellPress}
    />
  );
}