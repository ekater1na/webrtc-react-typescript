import React, { createContext, useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import Peer from 'peerjs';
import { v4 as uuidV4 } from 'uuid';

const WS = 'http://localhost:8080';

interface RoomValue {
  ws: unknown;
  me: unknown;
  // stream?: MediaStream;
  // screenStream?: MediaStream;
  // peers: PeerState;
  // shareScreen: () => void;
  // roomId: string;
  // setRoomId: (id: string) => void;
  // screenSharingId: string;
}

export const RoomContext = createContext<RoomValue | null>(null);

const ws = socketIOClient(WS);

interface Props {
  children: React.ReactNode;
}

export const RoomProvider: React.FunctionComponent<Props> = ({ children }) => {
  const navigate = useNavigate();
  const [me, setMe] = useState<Peer>();

  const enterRoom = ({ roomID }: { roomID: string }) => {
    console.log({ roomID });
    navigate(`/room/${roomID}`);
  };

  const getUsers = ({ participants }: { participants: string[] }) => {
    console.log({ participants });
  };

  useEffect(() => {
    const meId = uuidV4();
    const peer = new Peer(meId);
    setMe(peer);

    ws.on('room-created', enterRoom);
    ws.on('get-users', getUsers);
  }, []);

  return <RoomContext.Provider value={{ ws, me }}>{children}</RoomContext.Provider>;
};
