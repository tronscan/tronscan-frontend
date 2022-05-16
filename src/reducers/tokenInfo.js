import {
    TOKENINFO_UPDATE
} from "../constants";

const initialState = {
    tokenDetail: '',
    transferSearchStatus: false,
    transfer: {
        srTag: false,
        srName: null,
        balance: '',
        addressTag: null,
        holder_address: "",
        foundationTag: false,
        accountedFor: 0,
    },
    searchAddress: "",
    transfersListObj: {
        transfers: [],
        page: 1,
        total: 0,
        rangeTotal: 0,

    },
    transfers20ListObj: {
        transfers: [],
        page: 1,
        total: 0,
        rangeTotal: 0,
    },
    holders10ListObj: {
        rangeTotal: 0,
    },
    holders20ListObj: {
        rangeTotal: 0,
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