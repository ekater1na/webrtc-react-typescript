import React, { createContext, useEffect, useState, useReducer } from 'react';
import socketIOClient from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import Peer from 'peerjs';
import { v4 as uuidV4 } from 'uuid';
import { peersReducer, PeerState } from './peerReducer';
import { addPeerAction, removePeerAction } from './peerActions';

const WS = 'http://localhost:8080';

interface RoomValue {
  ws: unknown;
  me: unknown;
  stream: MediaStream;
  // screenStream?: MediaStream;
  peers: PeerState;
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
  const [stream, setStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peersReducer, {});

  const enterRoom = ({ roomID }: { roomID: string }) => {
    console.log({ roomID });
    navigate(`/room/${roomID}`);
  };

  const getUsers = ({ participants }: { participants: string[] }) => {
    console.log({ participants });
  };

  const removePeer = (peerID: string) => {
    dispatch(removePeerAction(peerID));
  };

  useEffect(() => {
    const meId = uuidV4();
    const peer = new Peer(meId);
    setMe(peer);

    try {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        setStream(stream);
      });
    } catch (error) {
      console.error(error);
    }

    ws.on('room-created', enterRoom);
    ws.on('get-users', getUsers);
    ws.on('user-disconnected', removePeer);
  }, []);

  useEffect(() => {
    if (!me) return;
    if (!stream) return;

    ws.on('user-joined', (peerID) => {
      const call = me.call(peerID, stream);
      call.on('stream', (peerStream) => {
        dispatch(addPeerAction(peerID, peerStream));
      });
    });

    me.on('call', (call) => {
      call.answer(stream);
      call.on('stream', (peerStream) => {
        dispatch(addPeerAction(call.peer, peerStream));
      });
    });
  }, [me, stream]);

  console.log({ peers });

  // @ts-ignore
  return <RoomContext.Provider value={{ ws, me, stream, peers }}>{children}</RoomContext.Provider>;
};
