import {
    TOKENINFO_UPDATE
} from "../constants";

const initialState = {
    tokenDetail: '',
    transferSearchStatus: false,
    transfer: {
        holder_address: '',
        balance: ''
    },
    transfersListObj: {
        transfers: [],
        page: 1,
        total: 0,
        rangeTotal: '',
    },
    transfers20ListObj: {
        transfers: [],
        page: 1,
        total: 0,
        rangeTotal: '',
    },
    start_timestamp: '',
    end_timestamp: ''

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