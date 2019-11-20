import { byteArray2hexStr } from "@tronscan/client/src/utils/bytes";
export function getOperationsHexStrByContractIdArr(contractIdArr) {
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
        0: AccountCreateContract,
        1: TransferContract,
        2: TransferAssetContract,
        3: VoteAssetContract,
        4: VoteWitnessContract,
        5: WitnessCreateContract,
        6: AssetIssueContract,
        8: WitnessUpdateContract,
        9: ParticipateAssetIssueContract,
        10: AccountUpdateContract,
        11: FreezeBalanceContract,
        12: UnfreezeBalanceContract,
        13: WithdrawBalanceContract,
        14: UnfreezeAssetContract,
        15: UpdateAssetContract,
        16: ProposalCreateContract,
        17: ProposalApproveContract,
        18: ProposalDeleteContract,
        19: SetAccountIdContract,
        20: CustomContract,
        // BuyStorageContract = 21,
        // BuyStorageBytesContract = 22,
        // SellStorageContract = 23,
        30: CreateSmartContract,
        31: TriggerSmartContract,
        32: GetContract,
        33: UpdateSettingContract,
        41: ExchangeCreateContract,
        42: ExchangeInjectContract,
        43: ExchangeWithdrawContract,
        44: ExchangeTransactionContract,
        45: UpdateEnergyLimitContract,
        46: AccountPermissionUpdateContract,
        48: ClearABIContract,
        49: UpdateBrokerageContract,
    }
}
export function getContractTypesByGroup() {
    return {
        Balance: {
            TransferContract: 1,
            FreezeBalanceContract: 11,
            UnfreezeBalanceContract: 12
        },
        Account: {
            AccountCreateContract: 0,
            AccountUpdateContract: 10,
            AccountPermissionUpdateContract: 46
        },
        TRC10: {
            TransferAssetContract: 2,
            ParticipateAssetIssueContract: 9,
            AssetIssueContract: 6,
            UnfreezeAssetContract: 14,
            UpdateAssetContract: 15
        },
        SmartContract: {
            TriggerSmartContract: 31,
            CreateSmartContract: 30,
            UpdateSettingContract: 33,
            UpdateEnergyLimitContract: 45,
            ClearABIContract: 48,
        },
        Representatives: {
            VoteWitnessContract: 4,
            WithdrawBalanceContract: 13,
            ProposalCreateContract: 16,
            ProposalApproveContract: 17,
            ProposalDeleteContract: 18,
            WitnessCreateContract: 5,
            WitnessUpdateContract: 8,
            UpdateBrokerageContract: 49
        },
        Bancor: {
            ExchangeTransactionContract: 44,
            ExchangeCreateContract: 41,
            ExchangeInjectContract: 42,
            ExchangeWithdrawContract: 43
        }
    }
}
export function getContractTypesByIds(ids) {
    const contractFilteredType = [];
    const allContractTypes = getAllContractTypes();
    let { entries } = Object;
    ids.forEach(id => {
        for (let [key, value] of entries(allContractTypes)) {
            if (id === key) {
                contractFilteredType.push({ id, value })
            }
        }
    })
    return contractFilteredType;
}