
import {Transaction} from "@tronscan/client/src/protocol/core/Tron_pb";
let contractTypes = {};
let ContractTypeObj = Transaction.Contract.ContractType
Object.assign(ContractTypeObj,{SHIELDEDTRANSFERCONTRACT: 51});

for (let key of Object.keys(ContractTypeObj)) {
  contractTypes[Transaction.Contract.ContractType[key]] = key;
}

export const ContractTypes = contractTypes;
