import { createContext, useEffect, useState } from "react";
import { json, useNavigate } from "react-router-dom";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const [wsMessage, setWsMessage] = useState();
  const [clinetKey, setClinetKey] = useState();
  const [remotePlayer, setRemotePlayer] = useState(null);
  const [room, setRoom] = useState(null);
  const [youOn, setYouOn] = useState(false);

  useEffect(() => {
    const socket = new WebSocket("wss://malom-server.paraghtibor.hu");
    setWs(socket);
  }, []);
  useEffect(() => {
    if (ws == null) return;
    ws.onmessage = (event) => {
      setWsMessage(event.data);
    };
  });
  useEffect(() => {
    if (wsMessage == null) return;
    var ms = JSON.parse(wsMessage);
    if (ms.key == "clinetID") {
      setClinetKey(ms.clinetID);
    } else if (ms.key == "matchFound") {
      setRemotePlayer(ms.opponent);
      setRoom(ms.room);
    } else if (ms.key === "roomUpdate") {
      setRoom(ms);
    }
    else if(ms.key == "opponentDisconnected"){
     window.location.href = "/jateknak-vege/"+btoa(encodeURIComponent("Az ellenfeled elhagyta a játékot, Te NYERTÉL!")+"")
    }
    console.log(wsMessage);
  }, [wsMessage]);

  useEffect(() => {
    if (room == null) return;
    setYouOn(room.whoOn != remotePlayer);

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 8; j++) {
        if (room.gameData[i][j] == 1 || room.gameData[i][j] == 2)
          document
            .getElementById(`${i}-${j}`)
            .classList.add(`u${room.gameData[i][j]}`);
        const element = document.getElementById(`${i}-${j}`);

        if (element != null) {
          element.classList.remove("selectable");
          element.classList.remove("selected_babu");
          if (room.gameData[i][j] == 0) {
            element.classList.remove("u1");
            element.classList.remove("u2");
          }
        }
      }
    }
  }, [room]);
  const WsSend = (data) => {
    ws.send(data);
  };
  return (
    <SocketContext.Provider
      value={{ WsSend, wsMessage, clinetKey, ws, remotePlayer, room, youOn }}>
      {children}
    </SocketContext.Provider>
  );
};
