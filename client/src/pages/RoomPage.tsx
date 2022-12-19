import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RoomContext } from '../context/RoomContext';

export const RoomPage = () => {
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { ws, me } = useContext(RoomContext);

  useEffect(() => {
    if (me) ws.emit('join-room', { roomID: id, peerID: me._id });
  }, [id, me, ws]);
  return <>Room ID {id}</>;
};
