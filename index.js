const path = require("path");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const format = require("./helperFunctions");
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "talk.html"));
});

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  // greeting the new user
  socket.emit("Welcome Message", format.Chatbot("Welcome To Talk To John Doe"));
  //putting the user in the correct room
  socket.on("join Room", (obj) => {
    socket.join(obj.room);
    obj["id"] = socket.id;
    if (obj.room === "public") {
      format.addToPublicRoom(obj);
    } else {
      format.addToPrivateRoom(obj);
    }
  });
  // handling messages
  socket.on("New Message", (msgInfo) => {
    let msgObj = msgInfo;
    msgObj["id"] = socket.id;
    io.in(msgInfo.room).emit("message", format.message(msgObj)); //sending to all clients in 'game' room(channel) except sender
  });
  socket.on("get current users", () => {
    socket.emit("online users", format.getCurrentUsers());
  });
  // handling disconnects
  socket.on("disconnect", () => {
    const data = format.handleDisconnect(socket.id);
    io.in(data.room).emit("user disconnected", data);
  });
});
server.listen(PORT, () => console.log(`Application is up on port ${PORT}`));
