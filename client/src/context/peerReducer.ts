import { ADD_PEER, REMOVE_PEER } from './peerActions';

export const initialState = {};

export type PeerState = Record<string, { stream: MediaStream }>;
type PeerAction =
  | {
      type: typeof ADD_PEER;
      payload: { peerID: string; stream: MediaStream };
    }
  | {
      type: typeof REMOVE_PEER;
      payload: { peerID: string };
    };

export const peersReducer = (state: PeerState = initialState, action: PeerAction): PeerState => {
  switch (action.type) {
    case ADD_PEER:
      return {
        ...state,
        [action.payload.peerID]: {
          stream: action.payload.stream,
        },
      };
    case REMOVE_PEER:
      const { [action.payload.peerID]: deleted, ...rest } = state;
      return rest;

    default:
      return { ...state };
  }
};
