import { useContext, useEffect, useState } from "react";
import Board from "./Components/Board";
import { GameContext } from "./Providers/GameProvider";
function Home() {
  const { gameState } = useContext(GameContext);

  return <>{gameState}</>;
}
export default Home;
