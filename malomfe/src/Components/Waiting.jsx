import { useContext, useEffect, useState } from "react";
import { GameContext } from "../Providers/GameProvider";
import { SocketContext } from "../Providers/SocketProvider";
import { useScroll } from "framer-motion";
function Waiting() {
  const { currentUser } = useContext(GameContext);
  const { remotePlayer } = useContext(SocketContext);

  const [comp, setComp] = useState(
    <>
      <div className="malom">
        <div>
          <h4>Kedves, {currentUser}</h4>
          <h1>Várakozás egy játékosra...</h1>
          <div className="mt-5 d-flex justify-content-center">
            <span class="loader mx-auto"></span>
          </div>
        </div>
      </div>
    </>
  );
  useEffect(() => {
    if (remotePlayer == null) return;

    setComp(
      <div className="malom">
        <h1>Az ellenfeled: {remotePlayer}</h1>
      </div>
    );
  }, [remotePlayer]);

  return <>{comp}</>;
}
export default Waiting;
