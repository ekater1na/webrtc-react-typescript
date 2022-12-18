import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

export const roomHandler = (socket: Socket) => {
  const createRoom = () => {
    const roomID = uuidV4();
    socket.join(roomID);
    socket.emit("room-created", { roomID });
    console.log(`Room created, ${roomID}`);
  };

  const joinRoom = () => {
    console.log("User joined the room");
  };

  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
};
