import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RoomContext } from '../context/RoomContext';

export const RoomPage = () => {
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { ws } = useContext(RoomContext);

  useEffect(() => {
    ws.emit('join-room', { roomID: id });
  }, []);
  return <>Room ID {id}</>;
};
