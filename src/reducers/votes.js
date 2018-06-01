import {SET_VOTE_LIST, SET_VOTE_TIMER} from "../actions/votes";

const initialState = {
  voteList: [],
  voteTimer: 0,
};

export function votesReducer(state = initialState, action) {

  switch (action.type) {
    case SET_VOTE_LIST: {
      return {
        ...state,
        voteList: action.voteList,
      };
    }

    case SET_VOTE_TIMER: {
      return {
        ...state,
        voteTimer: action.voteTimer,
      };
    }

    default:
      return state;
  }
}
