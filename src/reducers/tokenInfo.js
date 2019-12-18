import {
    TOKENINFO_UPDATE
} from "../constants";

const initialState = {
    tokenDetail: '',
    transferSearchStatus: false,
    transfer: {
        holder_address: '',
        balance: ''
    }

}

export function tokensInfo(state = initialState, action) {
    switch (action.type) {
        case TOKENINFO_UPDATE:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}