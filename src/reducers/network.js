import {SET_NODES, SET_WITNESSES} from "../actions/network";

const initialState = {
  witnesses: [],
  nodes: [],
};

export function networkReducer(state = initialState, action) {

  switch (action.type) {
    case SET_WITNESSES: {
      return {
        ...state,
        witnesses: action.witnesses,
      };
    }
    case SET_NODES: {
      return {
        ...state,
        nodes: action.nodes,
      };
    }
    default:
      return state;
  }
}
