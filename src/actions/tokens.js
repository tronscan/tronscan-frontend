import {Client} from "../services/api";

export const SET_TOKENS = 'SET_TOKENS';

export const setTokens = (tokens = []) => ({
  type: SET_TOKENS,
   tokens,
});



export const loadTokens = () => async (dispatch, getState) => {
  let {tokens} = await Client.getTokens();
  dispatch(setTokens(tokens));
};
