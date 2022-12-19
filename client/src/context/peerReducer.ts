import {ADD_PEER, REMOVE_PEER} from "./peerActions";


type PeerState = Record<string, { stream: MediaStream }>;
type PeerActions =
    | {
    type: typeof ADD_PEER,
    payload: { peerID: string, stream: MediaStream },
    }
    | {
    type: typeof REMOVE_PEER,
    payload: { peerID: string},
}

export const peersReducer = { state: PeerState, action: PeerActions} => {
    switch (action.type) {
        case ADD_PEER:
            return {
                ...state,
                [actions.payload.peerID]: {
                    stream: action.payload.stream
                }
            }
        case REMOVE PEER:
            const {[action.payload.peerID]: deleted, ...rest } = state;
            return rest;

        default:
            return {...state}

    }

}