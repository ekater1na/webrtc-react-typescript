import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

interface IRoomParams {
  roomID: string;
  peerID: string;
}

const rooms: Record<string, string[]> = {};

export const roomHandler = (socket: Socket) => {
  const createRoom = ({ peerID }: { peerID: string }) => {
    const roomID = uuidV4();
    rooms[roomID] = [];
    socket.emit("room-created", { roomID });
    console.log(`Room created, ${roomID}`);
    joinRoom({ roomID, peerID });
  };

  const joinRoom = ({ roomID, peerID }: IRoomParams) => {
    if (rooms[roomID]) {
      console.log(`User joined the room ${roomID} ${peerID}`);
      rooms[roomID].push(peerID);
      socket.join(roomID);
      socket.to(roomID).emit("user-joined", { roomID, peerID });
      socket.emit("get-users", {
        roomID,
        participants: rooms[roomID],
      });
    } else {
      createRoom({ peerID });
    }

    socket.on("disconnect", () => {
      console.log(`User left the room ${peerID}`);
      leaveRoom({ roomID, peerID });
    });
  };

  const startSharing = ({ peerID, roomID }: IRoomParams) => {
    socket.to(roomID).emit("user-started-sharing", peerID);
  };

  const stopSharing = ( roomID: string) => {
    socket.to(roomID).emit("user-stopped-sharing");
  };

  const leaveRoom = ({ roomID, peerID }: IRoomParams) => {
    socket.to(roomID).emit("user-disconnected", peerID);
    rooms[roomID] = rooms[roomID]?.filter((id) => id !== peerID);
  };

  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
  socket.on("start-sharing", startSharing);
  socket.on("stop-sharing", stopSharing);
  socket.on("leave-room", leaveRoom);
};
