import {SET_ACTIVE_WALLET, SET_WALLET_LOADING} from "../actions/wallet";
import {LOGOUT} from "../actions/app";

const initialState = {
  current: null,
  isOpen: false,
  wallets: [],
  isLoading: false,
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

      return {
        ...state,
        isOpen: true,
        current: {
          ...(state.current || {}),
          ...action.wallet,
        },
      };
    }

    case SET_WALLET_LOADING: {

      return {
        ...state,
        isLoading: action.loading,
      };
    }

    default:
      return state;
  }
}
