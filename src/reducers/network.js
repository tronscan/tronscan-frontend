import {SET_NODES, SET_WITNESSES,SET_STATISTIC_DATA} from "../actions/network";

const initialState = {
  witnesses: [],
  nodes: [],
  statisticData:[]
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
    case SET_STATISTIC_DATA: {
      return {
        ...state,
        statisticData: action.statisticData,
      };
    }
    default:
      return state;
  }
}
