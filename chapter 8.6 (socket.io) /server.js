const ws = require("ws");
const server = new ws.Server({ port: "3000" });

//basic websocket server app
server.on("connection", (socket) => {
  socket.on("message", (message) => {
    const b = Buffer.from(message);
    //we are not seeing the output we are just seeing the buffer so we must neede to know
    //how to convert the buffer
    console.log(b.toString());
    socket.send(`${message}`);
  });
});
