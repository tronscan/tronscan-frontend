import React from "react";
// import QRImageCode from "../common/QRImageCode";
// import bip39 from "bip39";

export default function PaperWallet({address, privateKey, addressQRCode, privateKeyQRCode}) {

  const tronLogo = require("../../images/tron-banner-1.png");
  // var mnemonic = bip39.entropyToMnemonic(privateKey);


  return (
      <div className="card d-inline-block">
        <div className="card-body d-flex">
          <div className="col text-center">
            <div className="font-weight-bold">Address</div>
            <img src={addressQRCode} style={styles.qr}/>
          </div>
          <div className="col">
            <img src={tronLogo} style={styles.logo}/>
          </div>
          <div className="col text-center">
            <div className="font-weight-bold">Private Key</div>
            <img src={privateKeyQRCode} style={styles.qr}/><br/>
          </div>
        </div>
        <div className="card-body p-0 text-center">
          <table className="table m-0">
            <tr>
              <th>
                Address
              </th>
              <td>
                {address}
              </td>
            </tr>
            <tr>
              <th style={styles.th}>
                Private Key
              </th>
              <td>
                {privateKey}
              </td>
            </tr>
            {/*<tr>*/}
            {/*<th>*/}
            {/*Code*/}
            {/*</th>*/}
            {/*<td>*/}
            {/*{mnemonic}*/}
            {/*</td>*/}
            {/*</tr>*/}
          </table>
        </div>
      </div>
  );
}


const styles = {
  logo: {
    height: 150,
    marginTop: 50,
  },
  qr: {
    height: 200,
  },
  th: {
    width: 200
  }
};
