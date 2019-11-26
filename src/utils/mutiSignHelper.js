import { byteArray2hexStr } from "@tronscan/client/src/utils/bytes";
export function getOperationsHexStrByContractIdArr(contractIdArr) {
    contractIdArr.sort(function(a,b){return a-b});
    console.log('contractIdArr',contractIdArr);
    let list = (contractIdArr.slice(0).slice(0));
    var operations = (function (s) {
        var a = []; while (s-- > 0)
            a.push(0); return a;
    })(32);
    list.forEach((function (operations) {
        return function (e) {
            operations[(e / 8 | 0)] |= (1 << e % 8);
        };
    })(operations));
    return byteArray2hexStr(operations);
}
function hex_to_bin(str) {
    let hex_array = [{ key: 0, val: "0000" }, { key: 1, val: "0001" }, { key: 2, val: "0010" }, { key: 3, val: "0011" }, { key: 4, val: "0100" }, { key: 5, val: "0101" }, { key: 6, val: "0110" }, { key: 7, val: "0111" },
    { key: 8, val: "1000" }, { key: 9, val: "1001" }, { key: 'a', val: "1010" }, { key: 'b', val: "1011" }, { key: 'c', val: "1100" }, { key: 'd', val: "1101" }, { key: 'e', val: "1110" }, { key: 'f', val: "1111" }]

    let value = ""
    for (let i = 0; i < str.length; i++) {
        for (let j = 0; j < hex_array.length; j++) {
            if (str.charAt(i) == hex_array[j].key) {
                value = value.concat(hex_array[j].val)
                break
            }
        }
    }
    return value
}
export function getContractIdByHex(strHex) {
    const contractBin = hex_to_bin(strHex);
    let contractBinArr = contractBin.match(/\d{8}/g);
    contractBinArr = contractBinArr.map(item => {
        return item.split('').reverse().join('');

    })
    let contractStr = contractBinArr.join('');
    const contractIdArr = [];

    for (let i = 0; i < contractStr.length; i++) {
        if (parseInt(contractStr[i])) {
            contractIdArr.push(i);
        }
    }
    return contractIdArr;
}

function getAllContractTypes() {
    return {
        0: 'AccountCreateContract',
        1: 'TransferContract',
        2: 'TransferAssetContract',
        3: 'VoteAssetContract',
        4: 'VoteWitnessContract',
        5: 'WitnessCreateContract',
        6: 'AssetIssueContract',
        8: 'WitnessUpdateContract',
        9: 'ParticipateAssetIssueContract',
        10: 'AccountUpdateContract',
        11: 'FreezeBalanceContract',
        12: 'UnfreezeBalanceContract',
        13: 'WithdrawBalanceContract',
        14: 'UnfreezeAssetContract',
        15: 'UpdateAssetContract',
        16: 'ProposalCreateContract',
        17: 'ProposalApproveContract',
        18: 'ProposalDeleteContract',
        19: 'SetAccountIdContract',
        20: 'CustomContract',
        // BuyStorageContract = 21,
        // BuyStorageBytesContract = 22,
        // SellStorageContract = 23,
        30: 'CreateSmartContract',
        31: 'TriggerSmartContract',
        32: 'GetContract',
        33: 'UpdateSettingContract',
        41: 'ExchangeCreateContract',
        42: 'ExchangeInjectContract',
        43: 'ExchangeWithdrawContract',
        44: 'ExchangeTransactionContract',
        45: 'UpdateEnergyLimitContract',
        46: 'AccountPermissionUpdateContract',
        48: 'ClearABIContract',
        49: 'UpdateBrokerageContract',
    }
}
export function getContractTypesByGroup() {
    return [
        {
            key: 'Balance',
            value: [
                { name: 'TransferContract', value: 1 },
                { name: 'FreezeBalanceContract', value: 11 },
                { name: 'UnfreezeBalanceContract', value: 12 }
            ]
        },
        {
            key: 'Account',
            value: [
                { name: 'AccountCreateContract', value: 0 },
                { name: 'AccountUpdateContract', value: 10 },
                { name: 'AccountPermissionUpdateContract', value: 46 }
            ]
        },
        {
            key: 'TRC10',
            value: [
                { name: 'TransferAssetContract', value: 2 },
                { name: 'ParticipateAssetIssueContract', value: 9 },
                { name: 'AssetIssueContract', value: 6 },
                { name: 'UnfreezeAssetContract', value: 14 },
                { name: 'UpdateAssetContract', value: 15 }
            ]
        },
        {
            key: 'SmartContract',
            value: [
                { name: 'TriggerSmartContract', value: 31 },
                { name: 'CreateSmartContract', value: 30 },
                { name: 'UpdateSettingContract', value: 33 },
                { name: 'UpdateEnergyLimitContract', value: 45 },
                { name: 'ClearABIContract', value: 48 },
            ]
        },
        {
            key: 'Representatives',
            value: [
                { name: 'VoteWitnessContract', value: 4 },
                { name: 'WithdrawBalanceContract', value: 13 },
                { name: 'ProposalCreateContract', value: 16 },
                { name: 'ProposalApproveContract', value: 17 },
                { name: 'ProposalDeleteContract', value: 18 },
                { name: 'WitnessCreateContract', value: 5 },
                { name: 'WitnessUpdateContract', value: 8 },
                { name: 'UpdateBrokerageContract', value: 49 }
            ]
        },
        {
            key: 'Bancor',
            value: [
                { name: 'ExchangeTransactionContract', value: 44 },
                { name: 'ExchangeCreateContract', value: 41 },
                { name: 'ExchangeInjectContract', value: 42 },
                { name: 'ExchangeWithdrawContract', value: 43 }
            ]
        }
    ]
}
export function getContractTypesByIds(ids) {
    const contractFilteredType = [];
    const allContractTypes = getAllContractTypes();
    let { entries } = Object;
    ids.forEach(id => {
        for (let [key, value] of entries(allContractTypes)) {
            if (id == key) {
                contractFilteredType.push({ id, value })
            }
        }
    })
    return contractFilteredType;
}

export function getContractTypesByHex(strHex) {
    const contractIds = getContractIdByHex(strHex);
    return getContractTypesByIds(contractIds);
}
