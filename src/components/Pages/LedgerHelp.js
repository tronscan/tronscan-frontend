import React, {Component} from 'react';
import {HrefLink} from "../common/Links";
import {tu} from "../../utils/i18n";

export default class LedgerHelp extends Component {

  render() {

    return (
        <main className="container header-overlap news">
          <div className="row _leger">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <h3>{tu('ledger_note')}</h3>
                  <ol>
                    <li>
                        {tu('ledger_note_message_1')}
                    </li>
                    <li>
                        {tu('ledger_note_message_2')}
                    </li>
                    <li>
                        {tu('ledger_note_message_3')}
                      <br/>
                        {tu('ledger_note_message_4')}
                    </li>
                  </ol>
                  <h3>{tu('requirements')}</h3>
                  <p>{tu('using_ledger_steps_message_0')}</p>
                  <ol>
                    <li>
                      {tu('a')} <HrefLink href="https://www.ledgerwallet.com/products/ledger-nano-s)">Ledger Nano
                      S</HrefLink>
                    </li>
                    <li>
                        {tu('install_the')}<HrefLink href="https://www.ledgerwallet.com/live"> Ledger
                      Live </HrefLink> {tu('app')}
                    </li>
                  </ol>
                  <h3>{tu('opening_your_wallet')}</h3>
                  <ol>
                    <li>
                      {tu('open_the_tronscan_desktop_client')}<HrefLink
                        href="https://tronscan.org/">tronscan.org</HrefLink>
                    </li>
                    <li>
                      {tu('click_open_wallet_top_right')}
                    </li>
                    <li>
                      {tu('choose_ledger')}
                    </li>
                    <li>
                      {tu('connect_unlock_ledger_with_pin')}
                    </li>
                    <li>
                      {tu('open_tron_app_on_ledger')}
                    </li>
                    <li>
                      {tu('ledger_connected_tronscan_message_0')}
                    </li>
                    <li>
                      {tu('click_on_open_wallet')}
                    </li>
                    <li>
                      {tu('redirect_to_your_wallet_message')}
                    </li>
                  </ol>
                  <h3>{tu('using_ledger_to_sign_transactions')}</h3>
                  <ol>
                    <li>
                      {tu('using_ledger_to_sign_transactions_message_0')}
                    </li>
                    <li>
                      {tu('using_ledger_to_sign_transactions_message_1')}
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
