import express from "express";
import http from "http";
import { Server } from "socket.io";

const port = 8000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", () => {
  console.log("User is connected");
});

server.listen(port, () => {
  console.log(`Listening to the server on port ${port}`);
});
