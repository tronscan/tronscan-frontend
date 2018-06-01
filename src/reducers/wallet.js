import {SET_ACTIVE_WALLET} from "../actions/wallet";
import {LOGOUT} from "../actions/app";

const initialState = {
  current: null,
  isOpen: false,
  wallets: [],
};

export function walletReducer(state = initialState, action) {

  switch (action.type) {

    case LOGOUT: {

      return {
        isOpen: false,
        current: null,
      };
    }

    case SET_ACTIVE_WALLET: {
      // console.log("SET WALLET", action);

      return {
        ...state,
        isOpen: true,
        current: {
          ...(state.current || {}),
          ...action.wallet,
        },
      };
    }

    default:
      return state;
  }
}
