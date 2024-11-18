const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const port = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, "public")));

// Data structures for tracking clients and play requests
const clients = new Map();
let playRequests = [];
let rooms = [];

// Helper function to generate a unique ID for each client
const generateUniqueID = () => Math.random().toString(36).substr(2, 9);

// Function to handle mill checking (malom) based on the game board structure
function malomCheck(room, userNumber, lastMove) {
  const board = room.gameData;
  const [lastRow, lastCol] = lastMove;

 // Define all possible mill (malom) positions on a 3x8 grid
const millPatterns = [
  // Horizontal rows - Layer 0
  [[0, 0], [0, 1], [0, 2]], // Row 1
  [[0, 3], [0, 4], [0, 5]], // Row 2
  [[0, 6], [0, 7], [0, 0]], // Wrap-around row

  // Horizontal rows - Layer 1
  [[1, 0], [1, 1], [1, 2]], // Row 1
  [[1, 3], [1, 4], [1, 5]], // Row 2
  [[1, 6], [1, 7], [1, 0]], // Wrap-around row

  // Horizontal rows - Layer 2
  [[2, 0], [2, 1], [2, 2]], // Row 1
  [[2, 3], [2, 4], [2, 5]], // Row 2
  [[2, 6], [2, 7], [2, 0]], // Wrap-around row

  // Vertical columns - Connecting layers
  [[0, 0], [1, 0], [2, 0]], // Column 1
  [[0, 1], [1, 1], [2, 1]], // Column 2
  [[0, 2], [1, 2], [2, 2]], // Column 3
  [[0, 3], [1, 3], [2, 3]], // Column 4
  [[0, 4], [1, 4], [2, 4]], // Column 5
  [[0, 5], [1, 5], [2, 5]], // Column 6
  [[0, 6], [1, 6], [2, 6]], // Column 7
  [[0, 7], [1, 7], [2, 7]], // Column 8

  // Vertical lines within each layer (inner rows)
  [[0, 2], [0, 3], [0, 4]], // Layer 0 middle row
  [[0, 4], [0, 5], [0, 6]], // Layer 0 inner row
  [[1, 2], [1, 3], [1, 4]], // Layer 1 middle row
  [[1, 4], [1, 5], [1, 6]], // Layer 1 inner row
  [[2, 2], [2, 3], [2, 4]], // Layer 2 middle row
  [[2, 4], [2, 5], [2, 6]], // Layer 2 inner row
];


  return millPatterns
    .filter(pattern => pattern.some(([row, col]) => row === lastRow && col === lastCol))
    .filter(pattern => pattern.every(([row, col]) => board[row][col] === userNumber))
    .filter(pattern => !room.checkedMills.some(checkedMill => 
      checkedMill.every(([row, col], index) => row === pattern[index][0] && col === pattern[index][1])
    ));
}

wss.on("connection", (ws) => {
  const clientID = generateUniqueID();
  clients.set(clientID, ws);

  console.log(`Client connected with ID: ${clientID}`);

  ws.send(JSON.stringify({ key: "clientID", clientID }));

  ws.on("message", (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      
      switch (parsedMessage.key) {
        case "playRequest":
          handlePlayRequest(ws, clientID, parsedMessage);
          break;
        case "playRequestGet":
          ws.send(JSON.stringify({ key: "playRequestList", playRequests }));
          break;
        case "chosen":
          handleChosenMove(clientID, parsedMessage);
          break;
        default:
          throw new Error("Unknown message key");
      }
    } catch (error) {
      console.error("Error processing message:", error);
      ws.send(JSON.stringify({
        from: "server",
        text: "Error processing message",
        error: error.message
      }));
    }
  });

  ws.on("close", () => {
    console.log(`Client ${clientID} disconnected`);
    handleClientDisconnect(clientID);
  });
});

function handleClientDisconnect(clientID) {
  clients.delete(clientID);
  playRequests = playRequests.filter(player => player.clientKey !== clientID);
  
  const roomIndex = rooms.findIndex(room => 
    room.player1.clientKey === clientID || room.player2.clientKey === clientID
  );
  
  if (roomIndex !== -1) {
    const room = rooms[roomIndex];
    const opponentClientKey = room.player1.clientKey === clientID ? room.player2.clientKey : room.player1.clientKey;
    const opponentWS = clients.get(opponentClientKey);
    
    if (opponentWS && opponentWS.readyState === WebSocket.OPEN) {
      opponentWS.send(JSON.stringify({
        key: "opponentDisconnected",
        message: "Your opponent has disconnected. You win!"
      }));
    }
    
    rooms.splice(roomIndex, 1);
  }
}

function handlePlayRequest(ws, clientID, message) {
  const player = { name: message.nev, clientKey: clientID };

  if (playRequests.length > 0) {
    const chosenPlayer = playRequests.shift();
    matchPlayers(player, chosenPlayer);
  } else {
    playRequests.push(player);
  }
}

function matchPlayers(player1, player2) {
  if (clients.has(player1.clientKey) && clients.has(player2.clientKey)) {
    const player1WS = clients.get(player1.clientKey);
    const player2WS = clients.get(player2.clientKey);

    if (player1WS.readyState === WebSocket.OPEN && player2WS.readyState === WebSocket.OPEN) {
      const room = createRoom(player1, player2);
      rooms.push(room);

      player1WS.send(JSON.stringify({
        key: "matchFound",
        opponent: player2.name,
        youStart: true,
        room
      }));

      player2WS.send(JSON.stringify({
        key: "matchFound",
        opponent: player1.name,
        youStart: false,
        room
      }));
    }
  }
}

function createRoom(player1, player2) {
  return {
    key: "roomUpdate",
    roomKey: generateUniqueID() + generateUniqueID(),
    player1,
    player2,
    whoOn: player1.name,
    gameData: Array(3).fill().map(() => Array(8).fill(0)),
    message: "",
    checkedMills: [],
    phase: "placing" 
  };
}

function handleChosenMove(clientID, message) {
  const roomIndex = rooms.findIndex(room => room.roomKey === message.roomKey);

  if (roomIndex === -1) {
    console.error(`Room not found: ${message.roomKey}`);
    return;
  }
 
  const room = rooms[roomIndex];
  const playerNum = room.whoOn === room.player1.name ? 1 : 2;

  if (isValidMove(room, message, playerNum)) {
    updateGameState(room, message, playerNum);
    broadcastGameState(room);
  } else {
    sendInvalidMoveMessage(clientID);
  }
}

function isValidMove(room, message, playerNum) {
  // Implement move validation logic here
  // Check if it's the player's turn, if the move is within bounds, etc.
  return true; // Placeholder
}

function updateGameState(room, message, playerNum) {
  const player1Pieces = room.gameData.flat().filter(cell => cell === 1).length;
  const player2Pieces = room.gameData.flat().filter(cell => cell === 2).length;
  if(player1Pieces == 2 && player2Pieces == 3){
    room.message = room.player1.name+", Nyert!";
  } else if(player2Pieces == 2) {
    room.message = room.player2.name+", Nyert!"
  }

  if(message.rm){
    room.gameData[message.a][message.b] = 0;
    room.whoOn = room.whoOn === room.player1.name ? room.player2.name : room.player1.name;
    room.message = "";
    return;
  }
  
  const lastMove = [message.a, message.b];
  room.gameData[message.a][message.b] = playerNum;

  if (message.ar != null && message.br != null) {
    room.gameData[message.ar][message.br] = 0;
  }

  const newMills = malomCheck(room, playerNum, lastMove);
  const hasMill = newMills.length > 0;

  if (hasMill) {
    room.checkedMills.push(...newMills);
    room.message = `${room.whoOn}, játékosnak malomja van!`;
  } else {
    room.whoOn = room.whoOn === room.player1.name ? room.player2.name : room.player1.name;
    room.message = "";
  }

  updateGamePhase(room);
}

function updateGamePhase(room) {
  const piecesCount = room.gameData.flat().filter(cell => cell !== 0).length;
  if (piecesCount < 18) {
    room.phase = "placing";
  } else if (piecesCount === 18) {
    room.phase = "moving";
  } else {
    const player1Pieces = room.gameData.flat().filter(cell => cell === 1).length;
    const player2Pieces = room.gameData.flat().filter(cell => cell === 2).length;
    if (player1Pieces === 3 || player2Pieces === 3) {
      room.phase = "flying";
    }
  }
}

function broadcastGameState(room) {
  const player1WS = clients.get(room.player1.clientKey);
  const player2WS = clients.get(room.player2.clientKey);

  if (player1WS && player1WS.readyState === WebSocket.OPEN) {
    player1WS.send(JSON.stringify(room));
  }

  if (player2WS && player2WS.readyState === WebSocket.OPEN) {
    player2WS.send(JSON.stringify(room));
  }
}

function sendInvalidMoveMessage(clientID) {
  const ws = clients.get(clientID);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      key: "invalidMove",
      message: "The move you attempted is not valid."
    }));
  }
}

app.get("/", (req, res) => {
  res.json(["malom-server.paraghtibor.hu"]);
});

app.get("/get-rooms", (req, res) => {
  res.json(rooms);
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

