import AppTrx from '@ledgerhq/hw-app-trx';
import Transport from "@ledgerhq/hw-transport-u2f";
import xhr from "axios/index";
import {decode58Check, isAddressValid} from "@tronscan/client/src/utils/crypto";
import { byteArray2hexStr } from "@tronscan/client/src/utils/bytes";
import { SUNWEBCONFIG } from "../../constants"
import { Client } from "../../services/api";
export default class LedgerBridge {
  constructor(win) {
    this.path = "44'/195'/0'/0/0";
  }

  //the path is BIP 32
  getPathForIndex (index) {
    return `44'/195'/${index}'/0/0`
  }

  isActivedAddress  = async(address) => {
    let data = await xhr.post(
      `${SUNWEBCONFIG.MAINFULLNODE}/walletsolidity/getaccount`,
      {
        address:this.address2hex(address)
      }
    );
    if(JSON.stringify(data.data) == "{}"){
      return false
    }
    return true
  } 

  getAddressTRXBalances = async(addressStr) => {
    let address = await Client.getAddress(addressStr);
    let sentDelegateBandwidth = 0;
    if (address.delegated && address.delegated.sentDelegatedBandwidth) {
      for (
        let i = 0;
        i < address.delegated.sentDelegatedBandwidth.length;
        i++
      ) {
        sentDelegateBandwidth =
          sentDelegateBandwidth +
          address.delegated.sentDelegatedBandwidth[i][
            "frozen_balance_for_bandwidth"
          ];
      }
    }

    let frozenBandwidth = 0;
    if (address.frozen.balances.length > 0) {
      frozenBandwidth = address.frozen.balances[0].amount;
    }

    let sentDelegateResource = 0;
    if (address.delegated && address.delegated.sentDelegatedResource) {
      for (let i = 0; i < address.delegated.sentDelegatedResource.length; i++) {
        sentDelegateResource =
          sentDelegateResource +
          address.delegated.sentDelegatedResource[i][
            "frozen_balance_for_energy"
          ];
      }
    }

    let frozenEnergy = 0;
    if (address.accountResource.frozen_balance_for_energy.frozen_balance > 0) {
      frozenEnergy =
        address.accountResource.frozen_balance_for_energy.frozen_balance;
    }

    let totalPower =
      sentDelegateBandwidth +
      frozenBandwidth +
      sentDelegateResource +
      frozenEnergy;
 
    return (address.balance + totalPower)
  } 

  address2hex (address){
    return byteArray2hexStr(
      decode58Check(address)
    ).toLowerCase();
  }
  

  async checkForConnection(index, confirm = false) {
    return new Promise(async (resolve, reject) => {
      const transport = await Transport.create();
      try {
        let path = this.getPathForIndex(index);
        const trx = new AppTrx(transport);
        let {address} = await trx.getAddress(path, confirm);
        resolve({
          address,
          connected: true,
        });
      } catch(e) {
        resolve({
          address: false,
          connected: false,
        });
      } finally {
        transport.close();
      }
    });
  }
  async getAddress(path) {
    return new Promise(async (resolve, reject) => {
      const transport = await Transport.create();
      try {
        const trx = new AppTrx(transport);
        let {address} = await trx.getAddress(path);
        resolve(address);
      } catch(e) {
        reject(e);
      } finally {
        transport.close();
      }
    });
  }
  async signTransaction(pathIndex,transaction) {
    return new Promise(async (resolve, reject) => {
      const transport = await Transport.create();
      try {
        let path = this.getPathForIndex(pathIndex);
        const trx = new AppTrx(transport);
        const response = await trx.signTransaction(
          path,
          transaction.hex,
          transaction.info
        );
        resolve(response);
      } catch(e) {
        reject(e);
      } finally {
        transport.close();
      }
    });
  }

}
