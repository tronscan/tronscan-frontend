
import {Transaction} from "@tronscan/client/src/protocol/core/Tron_pb";

let contractTypes = {};

for (let key of Object.keys(Transaction.Contract.ContractType)) {
  contractTypes[Transaction.Contract.ContractType[key]] = key;
}

export const ContractTypes = contractTypes;
