import React, {Component} from 'react';
import {HrefLink} from "../common/Links";

export default class LedgerHelp extends Component {

  render() {

    return (
      <main className="container header-overlap news">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <h1 className="text-center">Ledger Guide</h1>
                <h3>Requirements</h3>
                <p>Using the Ledger with Tronscan requires the following steps:</p>
                <ol>
                  <li>
                    A <HrefLink href="https://www.ledgerwallet.com/products/ledger-nano-s)">Ledger Nano S</HrefLink>
                  </li>
                  <li>
                    Install the <HrefLink href="https://www.ledgerwallet.com/live">Ledger Live</HrefLink> app
                  </li>
                  <li>
                    Install the latest version of <HrefLink href="https://github.com/tronscan/tronscan-desktop/releases">Tronscan Desktop</HrefLink>
                  </li>
                </ol>
                <h3>Opening your wallet</h3>
                <ol>
                  <li>
                    Open de Tronscan Desktop client
                  </li>
                  <li>
                    Click &ldquo;Open Wallet&rdquo; at the top right
                  </li>
                  <li>
                    Choose Ledger
                  </li>
                  <li>
                    Connect and unlock your device with your PIN code
                  </li>
                  <li>
                    Open the Tron app on your Ledger
                  </li>
                  <li>
                    If your Ledger is connected properly then Tronscan will show &ldquo;Connected&rdquo;
                  </li>
                  <li>
                    Click on &ldquo;Open Wallet&rdquo;
                  </li>
                  <li>
                    You will be redirected to your wallet and you can view your Tron address
                  </li>
                </ol>
                <h3>Using the ledger to sign transactions</h3>
                <ol>
                  <li>
                    Make sure to keep the Ledger connected and the Tron app open to sign transactions using the Ledger while using Tronscan Desktop
                  </li>
                  <li>
                    Tronscan will show a popup with the transaction details when a transaction signature is required. Signatures are required whenever you vote, send TRX, change account name, etc..
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}
