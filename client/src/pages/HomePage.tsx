import React from 'react';
import { CreateRoomButton } from '../components/CreateRoomButton';

export const HomePage = () => {
  return (
    <div className="App flex items-center justify-center w-screen h-screen">
      <CreateRoomButton />
    </div>
  );
};
