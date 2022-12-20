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
  peers: PeerState;
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
    participants.map((peerId) => {
      const call = stream && me?.call(peerId, stream);
      console.log('call', call);
      call?.on('stream', (userVideoStream: MediaStream) => {
        console.log({ addPeerAction });
        dispatch(addPeerAction(peerId, userVideoStream));
      });
    });
  };

  const removePeer = (peerID: string) => {
    dispatch(removePeerAction(peerID));
  };

  useEffect(() => {
    const meId = uuidV4();
    const peer = new Peer(meId, {
      host: 'localhost',
      port: 9000,
      path: '/myapp',
    });
    setMe(peer);

    try {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        setStream(stream);
      });
    } catch (error) {
      console.error({ error });
    }

    ws.on('room-created', enterRoom);
    ws.on('get-users', getUsers);
    ws.on('user-disconnected', removePeer);
  }, []);

  useEffect(() => {
    if (!me) return;
    if (!stream) return;

    ws.on('user-joined', ({ peerID }: { roomID: string; peerID: string }) => {
      const call = stream && me.call(peerID, stream);
      call.on('stream', (userVideoStream: MediaStream) => {
        dispatch(addPeerAction(peerID, userVideoStream));
      });
    });

    me.on('call', (call) => {
      call.answer(stream);
      call.on('stream', (userVideoStream) => {
        dispatch(addPeerAction(call.peer, userVideoStream));
      });
    });
  }, [stream, me]);

  console.log({ peers });

  // @ts-ignore
  return <RoomContext.Provider value={{ ws, me, stream, peers }}>{children}</RoomContext.Provider>;
};
