import React, { useEffect } from 'react';
import './App.css';
import socketIO from 'socket.io-client';

const WS = 'http://localhost:8080';

function App() {
  useEffect(() => {
    socketIO(WS);
  }, []);

  return (
    <div className="App flex items-center justify-center w-screen h-screen">
      <button className="bg-rose-600 py-2 px-8 rounded-lg text-xl hover:bg-rose-800 text-white">
        Start new meeting
      </button>
    </div>
  );
}

export default App;
