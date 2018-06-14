import Lockr from "lockr";


export function saveWallet(wallet) {
  Lockr.set("wallet", wallet);
}

export function loadWalletFromLocalStorage() {
  return Lockr.get("wallet");
}
