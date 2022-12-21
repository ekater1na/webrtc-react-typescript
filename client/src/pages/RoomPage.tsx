import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RoomContext } from '../context/RoomContext';
import { VideoPlayer } from '../components/VideoPlayer';
import { ShareScreenButton } from '../components/ShareScreenButton';

export const RoomPage = () => {
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { ws, me, peers, stream, shareScreen, screenSharingId, setRoomId } =
    useContext(RoomContext);

  useEffect(() => {
    me?.on('open', () => {
      ws.emit('join-room', { roomId: id, peerId: me._id });
    });
  }, [id, me, ws]);

  useEffect(() => {}, [id, setRoomId]);

  console.log({ screenSharingId });

  const screenSharingVideo = screenSharingId === me?.id ? stream : peers[screenSharingId].stream;

  const { [screenSharingId]: sharing, ...peersToShow } = peers;

  return (
    <div>
      <>Room id {id}</>
      <div className="flex">
        {screenSharingVideo && (
          <div className="w-4/5 px-4">
            <VideoPlayer stream={screenSharingVideo} />
          </div>
        )}
        <div
          className={`grid grid-cols-4 gap-4 ${
            screenSharingVideo ? 'w-1/5 grid-col-1' : 'grid-col-1'
          }`}
        >
          {screenSharingId !== me?.id && <VideoPlayer key={'me'} stream={stream} />}

          {Object.values(peers).map((peer: unknown, i) => (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            <VideoPlayer key={i} stream={peer.stream} />
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 p-6 w-full flex justify-center border-t-2 bg-white">
        <ShareScreenButton onClick={shareScreen} />
      </div>
    </div>
  );
};
