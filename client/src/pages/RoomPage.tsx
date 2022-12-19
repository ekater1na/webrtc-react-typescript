import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RoomContext } from '../context/RoomContext';
import { VideoPlayer } from '../components/VideoPlayer';

export const RoomPage = () => {
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { ws, me, peers, stream } = useContext(RoomContext);

  useEffect(() => {
    me?.on('open', () => {
      ws.emit('join-room', { roomId: id, peerId: me._id });
    });
  }, [id, me, ws]);

  return (
    <div>
      <>Room id {id}</>
      <div className="grid grid-cols-4 gap-4">
        <VideoPlayer key={'me'} stream={stream} />

        {Object.values(peers).map((peer: unknown, i) => (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <VideoPlayer key={i} stream={peer.stream} />
        ))}
      </div>
    </div>
  );
};
