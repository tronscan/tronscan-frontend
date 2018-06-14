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
        ...state,
        isOpen: false,
        current: null,
      };
    }

    case SET_ACTIVE_WALLET: {

      return {
        ...state,
        isOpen: true,
        current: {
          readonly: false,
          ...(state.current || {}),
          ...action.wallet,
        },
      };
    }

    default:
      return state;
  }
}
