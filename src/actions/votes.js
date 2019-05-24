import {Client} from "../services/api";
import {addSeconds} from "date-fns";
import moment from 'moment';

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
  //let timeUntilNext = await Client.secondsUntilNextCycle();
  let date =  moment().format("YYYY-MM-DD")
    // console.log('moment()',moment());
    // console.log('momentDate',momentDate);
    // console.log('new Date().toLocaleDateString()',new Date().toLocaleDateString());
    // console.log('new Date()',new Date());

  let dateString=new Date().toLocaleDateString().replace(/\//g, '-');
  let dateStringArray=dateString.split('-');
  if(dateStringArray[1].length<2){
    dateStringArray[1]='0'+dateStringArray[1];
  }
  if(dateStringArray[2].length<2){
    dateStringArray[2]='0'+dateStringArray[2];
  }
 // let date= dateStringArray[0]+'-'+dateStringArray[1]+'-'+dateStringArray[2];
  let time = (new Date(date).getTime() + (Math.floor((Date.parse(new Date() + '') - new Date(date).getTime()) / (6 * 60 * 60 * 1000)) + 1) * 6 * 60 * 60 * 1000 - Date.parse(new Date() + ''));
  dispatch(setVoteTimer(addSeconds(new Date(), time / 1000)));
};
