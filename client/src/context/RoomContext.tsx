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
  shareScreen: () => void;
  screenSharingId: string;
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
  const [screenSharingId, setScreenSharingId] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');

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

  const switchScreenSharing = (stream: MediaStream) => {
    setStream(stream);
    setScreenSharingId(me?.id || '');
  };

  const shareScreen = () => {
    try {
      if (screenSharingId) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then(switchScreenSharing)
          .catch((err) => console.error(err));
      } else {
        navigator.mediaDevices
          .getDisplayMedia({})
          .then(switchScreenSharing)
          .catch((err: Error) => console.error(err));
      }

      // @ts-ignore
      Object.keys(me?.connections).forEach((key: string) => {
        const videoTrack = stream!.getTracks().find((track) => track.kind === 'video');
        // @ts-ignore
        me?.connections[key][0].peerConnection
          .getSenders()[1]
          .replaceTrack(videoTrack)
          .catch((err: Error) => console.error(err));
      });
    } catch (err) {
      console.error(err);
    }
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
    ws.on('user-started-sharing', (peerId) => setScreenSharingId(peerId));
    ws.on('user-stopped-sharing', () => setScreenSharingId(''));

    return () => {
      ws.off('user-joined');
      ws.off('room-created');
      ws.off('get-users');
      ws.off('user-disconnected');
      ws.off('user-started-sharing');
      ws.off('user-stopped-sharing');
    };
  }, []);

  useEffect(() => {
    if (screenSharingId) {
      ws.emit('start-sharing', { peerID: screenSharingId, roomId });
    } else {
      ws.emit('stop-sharing');
    }
  }, [screenSharingId, roomId]);

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

  return (
    // @ts-ignore
    <RoomContext.Provider value={{ ws, me, stream, peers, shareScreen, screenSharingId }}>
      {children}
    </RoomContext.Provider>
  );
};
