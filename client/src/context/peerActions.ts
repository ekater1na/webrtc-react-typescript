export const ADD_PEER = 'ADD_PEER' as const;
export const REMOVE_PEER = 'REMOVE_PEER' as const;

import React from 'react';

export const addPeerActions = (peerID: string, stream: MediaStream) => ({
  type: ADD_PEER,
  payload: { peerID, stream },
});

export const removePeerActions = (peerID: string) => ({
    type: REMOVE_PEER,
    payload: { peerID },
});