import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RoomContext } from '../context/RoomContext';
import { VideoPlayer } from '../components/VideoPlayer';
import { PeerState } from '../context/peerReducer';

export const RoomPage = () => {
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { ws, me, stream, peers } = useContext(RoomContext);

  useEffect(() => {
    if (me) ws.emit('join-room', { roomID: id, peerID: me._id });
  }, [id, me, ws]);

  return (
    <>
      Room ID {id}
      <div className="grid grid-cols-4 gap-4">
        <VideoPlayer stream={stream} />

        {Object.values(peers as PeerState).map((peer, i) => {
          <VideoPlayer key={i} stream={peer.stream} />;
        })}
      </div>
    </>
  );
};
