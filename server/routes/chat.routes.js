import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("New connection");

  socket.on("sendMessage", (message) => {
    io.emit("message", { user: socket.id, text: message });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

export default server;