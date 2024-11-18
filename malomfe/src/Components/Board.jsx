import { useContext, useEffect } from "react";
import { GameContext } from "../Providers/GameProvider";
import { SocketContext } from "../Providers/SocketProvider";
function Board() {
  const { currentUser, moveOrSet, men , removed} = useContext(GameContext);
  const { ws, room, youOn, remotePlayer } = useContext(SocketContext);
  const Select = (a, b, c) => {
    moveOrSet(a, b, c);
  };
  useEffect(() => {
    console.log(youOn);
  }, [youOn]);
  return (
    <>
      <div className="game-info container">
        <h3 className="text-black text-center">
          {youOn
            ? "Te következel!"
            : "Várakozás a következőte: " + remotePlayer}
        </h3>
      </div>
      <div className="d-flex justify-content-between mt-2">
        <div className="d-flex">
          {Array(men)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className={`${
                  currentUser === room.player1.name ? "u1-v" : "u2-v"
                } mx-2`}
              ></div>
            ))}
        </div>
        <div className="d-flex">
          {Array(removed)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className={`${
                  !currentUser == room.player1.name ? "u1-v" : "u2-v"
                } mx-2`}
              ></div>
            ))}
        </div>
      </div>

      <div className="malom">
        <div className="board">
          <div className="square outer"></div>
          <div className="square middle"></div>
          <div className="square inner"></div>
          <div
            className="vertical-line"
            style={{ left: "50%", top: "5%" }}
          ></div>
          <div
            className="vertical-line"
            style={{ left: "50%", bottom: "5%" }}
          ></div>
          <div
            className="horizontal-line"
            style={{ top: "50%", left: "5%" }}
          ></div>
          <div
            className="horizontal-line"
            style={{ top: "50%", right: "5%" }}
          ></div>
          <div
            className="spot"
            style={{ left: "5%", top: "6%" }}
            onClick={(item) => Select(item, 0, 0)}
            id="0-0"
          ></div>
          <div
            className="spot"
            style={{ left: "50%", top: "5%" }}
            onClick={(item) => Select(item, 0, 1)}
            id="0-1"
          ></div>
          <div
            className="spot"
            style={{ right: "1%", top: "5%" }}
            onClick={(item) => Select(item, 0, 2)}
            id="0-2"
          ></div>
          <div
            className="spot"
            style={{ left: "5%", top: "50%" }}
            onClick={(item) => Select(item, 0, 7)}
            id="0-7"
          ></div>

          <div
            className="spot"
            style={{ right: "0.5%", top: "50%" }}
            onClick={(item) => Select(item, 0, 3)}
            id="0-3"
          ></div>
          <div
            className="spot"
            style={{ left: "5%", bottom: "0.5%" }}
            onClick={(item) => Select(item, 0, 6)}
            id="0-6"
          ></div>
          <div
            className="spot"
            style={{ left: "50%", bottom: "0.5%" }}
            onClick={(item) => Select(item, 0, 5)}
            id="0-5"
          ></div>
          <div
            className="spot"
            style={{ right: "0.5%", bottom: "0.5%" }}
            onClick={(item) => Select(item, 0, 4)}
            id="0-4"
          ></div>

          {/* Middle square spots */}
          <div
            className="spot"
            style={{ left: "20%", top: "20%" }}
            onClick={(item) => Select(item, 1, 0)}
            id="1-0"
          ></div>
          <div
            className="spot"
            style={{ left: "50%", top: "20%" }}
            onClick={(item) => Select(item, 1, 1)}
            id="1-1"
          ></div>
          <div
            className="spot"
            style={{ right: "16%", top: "20%" }}
            onClick={(item) => Select(item, 1, 2)}
            id="1-2"
          ></div>
          <div
            className="spot"
            style={{ left: "20%", top: "50%" }}
            onClick={(item) => Select(item, 1, 7)}
            id="1-7"
          ></div>
          <div
            className="spot"
            style={{ left: "35%", bottom: "45.5%" }}
            onClick={(item) => Select(item, 2, 7)}
            id="2-7"
          ></div>
          <div
            className="spot"
            style={{ right: "30.5%", top: "50%" }}
            onClick={(item) => Select(item, 2, 3)}
            id="2-3"
          ></div>
          <div
            className="spot"
            style={{ right: "15.5%", top: "50%" }}
            onClick={(item) => Select(item, 1, 3)}
            id="1-3"
          ></div>
          <div
            className="spot"
            style={{ left: "20%", bottom: "15.5%" }}
            onClick={(item) => Select(item, 1, 6)}
            id="1-6"
          ></div>
          <div
            className="spot"
            style={{ left: "50%", bottom: "15%" }}
            onClick={(item) => Select(item, 1, 5)}
            id="1-5"
          ></div>
          <div
            className="spot"
            style={{ right: "15.5%", bottom: "15.5%" }}
            onClick={(item) => Select(item, 1, 4)}
            id="1-4"
          ></div>

          {/* Inner square spots */}
          <div
            className="spot"
            style={{ left: "35%", top: "35%" }}
            onClick={(item) => Select(item, 2, 0)}
            id="2-0"
          ></div>
          <div
            className="spot"
            style={{ left: "50%", top: "35%" }}
            onClick={(item) => Select(item, 2, 1)}
            id="2-1"
          ></div>
          <div
            className="spot"
            style={{ right: "31%", top: "35%" }}
            onClick={(item) => Select(item, 2, 2)}
            id="2-2"
          ></div>
          <div
            className="spot"
            style={{ left: "35%", bottom: "31%" }}
            onClick={(item) => Select(item, 2, 6)}
            id="2-6"
          ></div>
          <div
            className="spot"
            style={{ left: "50%", bottom: "31%" }}
            onClick={(item) => Select(item, 2, 5)}
            id="2-5"
          ></div>
          <div
            className="spot"
            style={{ right: "31%", bottom: "31%" }}
            onClick={(item) => Select(item, 2, 4)}
            id="2-4"
          ></div>
        </div>
      </div>
    </>
  );
}
export default Board;
