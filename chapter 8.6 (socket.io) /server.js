//Here we are not using express we are using without express
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  //cross origin resource sharing - it is a security feature that allow the server to which port it must talk
  cors: {
    //origin: "*" //no one is block this is not good
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : ["http://localhost:5500", "http://127.0.0.1:5500"],
  },
});
//basic socket  server app
io.on("connection", (socket) => {
  console.log(`user ${socket.id} connect `);

  socket.on("message", (data) => {
    console.log(data);
    io.emit("message", `${socket.id.substring(0, 5)}: ${data}`);
  });
});

httpServer.listen(3000, () => console.log("Listening the server "));
