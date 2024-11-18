import { createContext, useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "./SocketProvider";
import GameStarter from "../Components/GameStarter";
import Waiting from "../Components/Waiting";
import Board from "../Components/Board";
import { useReducedMotion } from "framer-motion";
export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { ws, clinetKey, remotePlayer, youOn, room, wsMessage } =
    useContext(SocketContext);
  const [gameState, setGameState] = useState(<GameStarter />);
  const [currentUser, setCurrentUser] = useState(null);
  const [men, setMen] = useState(9);
  const selected = useRef(null);
  const enableRemove = useRef(false);
  const [removed, setRemoved] = useState(0);

  useEffect(() => {
    if (room == null) return;
    if (room.message.length != 0) {
      if(room.message.split(',')[0] == currentUser)
      enableRemove.current = true;
    
    }
    
   if(room.phase != "placing"){
      var mykey = room.player1.name == currentUser ? 1 : 2;
      var oppkey = room.player1.name == currentUser ? 2 : 1;
      var mycount = 0;
      var oppcount = 0;
      for (let j = 0; j < 3; j++) { 
        for (let i = 0; i < 8; i++) { 
          if (room.gameData[j][i] === mykey) mycount++;
          if (room.gameData[j][i] === oppkey) oppcount++;
        }
      }
      if(mycount == 3 &&  oppcount == 2){
          window.location.href = "/jateknak-vege/"+btoa(encodeURIComponent("Gratulálok, te nyertél!")+"")
      } else if(mycount == 2 && oppcount == 3){
        window.location.href = "/jateknak-vege/"+btoa(encodeURIComponent("Vesztettél!")+"")
      }
    }
    
  
  }, [room]);

  useEffect(() => {
   
  }, [wsMessage])

  useEffect(() => {
    if (currentUser == null) return;

    setGameState(<Waiting />);

    ws.send(
      JSON.stringify({
        key: "playRequest",
        nev: currentUser,
        clinet_key: clinetKey,
      })
    );
  }, [currentUser]);

  const moveOrSet = (a, b, c) => {
    if (!youOn) return alert("Nem te következel!");

    if (men != 0) decremnetMen();
    if (selected.current == null && men != 0) {
      if (!CheckSpot(b, c)) return alert("Ez a hely már foglalt!");
    }

    if (men == 0) {
      if (enableRemove.current && selected.current == null) {
        ws.send(
          JSON.stringify({
            key: "chosen",
            roomKey: room.roomKey,
            a: b,
            b: c,
            rm: true,
          })
        );
        setRemoved(removed+1);
        enableRemove.current = false;
        return;
      }
      if (selected.current != null) {
        if (
          CheckStepIsRegular(
            a,
            selected.current[0],
            selected.current[1],
            selected.current[2],
            b,
            c
          ) || room.phase == "flying"
        )
          ws.send(
            JSON.stringify({
              key: "chosen",
              roomKey: room.roomKey,
              a: b,
              b: c,
              ar: selected.current[1],
              br: selected.current[2],
            })
          );
        selected.current = null;
      } else {
        if (room.gameData[b][c] == 0) {
          return alert("a saját bábudat választd ki (üreset nem lehet)");
        }
        var playerN = room.player1.name != remotePlayer ? 1 : 2;
        if (room.gameData[b][c] != playerN && room.gameData[b][c] != 0) {
          return alert("az nem a te babúd!");
        }

        var stepsAvailabe = 0;

        if (b - 1 > -1 && c % 2 != 0 && room.gameData[b - 1][c] == 0) {
          document.getElementById(`${b - 1}-${c}`).classList.add("selectable");
          stepsAvailabe++;
        }
        if (b != 2 && b + 1 > 0 && c % 2 != 0 && room.gameData[b + 1][c] == 0) {
          document.getElementById(`${b + 1}-${c}`).classList.add("selectable");
          stepsAvailabe++;
        }
        if (c - 1 < 8 && c - 1 > -1 && room.gameData[b][c - 1] == 0) {
          document.getElementById(`${b}-${c - 1}`).classList.add("selectable");
          stepsAvailabe++;
        }
        if (c + 1 < 8 && room.gameData[b][c + 1] == 0) {
          document.getElementById(`${b}-${c + 1}`).classList.add("selectable");
          stepsAvailabe++;
        }
        if (c == 7 && room.gameData[b][0] == 0) {
          document.getElementById(`${b}-${0}`).classList.add("selectable");
          stepsAvailabe++;
        }
        if (c == 0 && room.gameData[b][7] == 0) {
          document.getElementById(`${b}-${7}`).classList.add("selectable");
          stepsAvailabe++;
        }
        if (stepsAvailabe > 0) {
          a.target.classList.add("selected_babu");
          selected.current = [a, b, c];
        } else {
          alert("Ezzel a babúval nem lehetséges a lépés. (nincs szabad hely!)");
        }
      }
    } else {
      ws.send(
        JSON.stringify({
          key: "chosen",
          roomKey: room.roomKey,
          a: b,
          b: c,
          ar: null,
          br: null,
        })
      );
    }
  };
 
  const CheckSpot = (b, c) => {
    return room.gameData[b][c] == 0;
  };
  const CheckStepIsRegular = (itemnew, itemold, a, b, c, d) => {
    if (men != 0) return true;

    return true;
  };

  const decremnetMen = () => {
    if (men == 0) return;
    setMen(men - 1);
  };

  useEffect(() => {
    if (remotePlayer == null) return;
    setTimeout(() => setGameState(<Board />), 2000);
  }, [remotePlayer]);
  return (
    <GameContext.Provider
      value={{ gameState, setCurrentUser, currentUser, moveOrSet, men, removed }}>
      {children}
    </GameContext.Provider>
  );
};
