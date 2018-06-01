import {Client} from "../services/api";
import {addSeconds} from "date-fns";

export const SET_VOTE_LIST = 'SET_VOTE_LIST';
export const SET_VOTE_TIMER = 'SET_VOTE_TIMER';

export const setVoteList = (voteList) => ({
  type: SET_VOTE_LIST,
  voteList
});

export const setVoteTimer = (voteTimer) => ({
  type: SET_VOTE_TIMER,
  voteTimer
});

export const loadVoteList = () => async (dispatch) => {
  let {candidates} = await Client.getVotesForCurrentCycle();
  dispatch(setVoteList(candidates));
};


export const loadVoteTimer = () => async (dispatch) => {
  let timeUntilNext = await Client.secondsUntilNextCycle();
  dispatch(setVoteTimer(addSeconds(new Date(), timeUntilNext)));
};
