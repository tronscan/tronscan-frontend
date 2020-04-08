import {
    TOKENINFO_UPDATE
} from "../constants";


export function updateTokenInfo(data) {
    return {
        type: TOKENINFO_UPDATE,
        payload: data
    }
}