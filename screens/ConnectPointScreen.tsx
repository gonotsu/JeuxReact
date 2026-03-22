import ConnectPointsComponent from "@/components/ConnectPoints";
import { useConnectPointsGame } from "../usecases/connectPointsGame";

export default function ConnectPointsScreen() {
  const {
    placedPoints,
    paths,
    isSolved,
    remainingPairs,
    placePoint,
    reset,
    solve,
  } = useConnectPointsGame({ initialNumPairs: 5 });

  return (
    <ConnectPointsComponent
      placedPoints={placedPoints}
      paths={paths}
      isSolved={isSolved}
      remainingPairs={remainingPairs}
      onPlacePoint={placePoint}
      onReset={reset}
      onSolve={solve}
    />
  );
}