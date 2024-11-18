const socket = new WebSocket("ws://localhost:3000");
var clinets_key = "";
socket.onmessage = (event) => {
  if (clinets_key.length == 0) {
    clinets_key = event.data;
    return;
  }
  const message = JSON.parse(event.data);

  console.log("Message from server:", message);
};

socket.onclose = () => {
  console.log("Disconnected from server");
};

socket.onerror = (error) => {
  console.log("WebSocket error:", error);
};

function sendPlayRequest() {
  socket.send(
    JSON.stringify({
      key: "playRequest",
      nev: "tibor",
      clinet_key: clinets_key,
    })
  );
}
function playRequestgGet() {
  socket.send(
    JSON.stringify({
      key: "playRequestgGet",
    })
  );
}
