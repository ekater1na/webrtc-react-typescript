import React, { createContext, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const WS = 'http://localhost:8080';

interface RoomValue {
  ws: unknown;
  // stream?: MediaStream;
  // screenStream?: MediaStream;
  // peers: PeerState;
  // shareScreen: () => void;
  // roomId: string;
  // setRoomId: (id: string) => void;
  // screenSharingId: string;
}

export const RoomContext = createContext<RoomValue | MediaStream | null>(null);

const ws = socketIOClient(WS);

interface Props {
  children: React.ReactNode;
}

export const RoomProvider: React.FunctionComponent<Props> = ({ children }) => {
  const enterRoom = ({ roomID }: { roomID: string }) => {
    console.log({ roomID });
  };

  useEffect(() => {
    ws.on('room-created', enterRoom);
  }, []);

  return <RoomContext.Provider value={{ ws }}>{children}</RoomContext.Provider>;
};
