const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();

const server = http.createServer(app);

//initiate socket.io and attach this to the http server
const io = socketIo(server);

//server the static file from the public folder
app.use(express.static("public"));

const user = new Set(); //store the users

io.on("connection", (socket) => {
  console.log("A user is now connected ");

  //handle users when they will join the chat
  //used to listen the emited username
  socket.on("join", (userName) => {
    user.add(userName);
    socket.userName = userName;

    //we have to broadcast to all user that a new user has join ,
    //all user must needed to know when a user is joined

    io.emit("userJoined", userName);

    //send the updated user list to all clients
    io.emit("userList", Array.from(user)); //convert the set into array
  });

  //handle the incomming chat message
  socket.on("chatmessage", (message) => {
    //broadcast all the message to all connected clients
    io.emit("chatmessage", message);
  });

  //handle disconnection
  socket.on("disconnect ", () => {
    console.log("An user is disconnected ");

    user.forEach((user) => {
      if (user == socket.userName) {
        user.delete(user);

        io.emit("userLeft", user);

        io.emit("userlist", Array.from(user));
      }
    });
  });
});

server.listen(3000, () => {
  console.log("server is listening ");
});
