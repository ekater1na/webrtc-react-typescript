import React, { useContext } from 'react';
import { RoomContext } from '../context/RoomContext';

export const CreateRoomButton: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { ws, me } = useContext(RoomContext);

  const createRoom = () => {
    ws.emit('create-room', { peerID: me._id });
  };

  return (
    <button
      className="bg-rose-600 py-2 px-8 rounded-lg text-xl hover:bg-rose-800 text-white"
      onClick={createRoom}
    >
      Start new meeting
    </button>
  );
};
