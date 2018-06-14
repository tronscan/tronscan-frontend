import React, {Component} from 'react';
import {Provider} from "react-redux";
import {store} from "../store";
import MainWrap from "./MainWrap";
import {PriceProvider} from "./common/Price";
import {loadSyncStatus} from "../actions/app";

import ReduxToastr from 'react-redux-toastr'
import {loadWalletFromLocalStorage} from "../utils/storage";
import {loadWalletFromAddressReadOnly, loadWalletFromLedger} from "../actions/wallet";
import {Client} from "../services/api";
import LedgerSigner from "../hw/ledger/LedgerSigner";

class App extends Component {

  constructor() {
    super();
    this.state = {
      loading: true,
      store,
    };
  }

  loadWallet() {
    let savedWallet = loadWalletFromLocalStorage();
    if (savedWallet) {
      let {type, address} = savedWallet;

      switch (type) {
        case "readonly":
          this.state.store.dispatch(loadWalletFromAddressReadOnly(address));
          break;

        case "ledger":
          this.state.store.dispatch(loadWalletFromLedger(address));
          Client.setSigner(new LedgerSigner());
          break;
      }
    }
  }

  componentDidMount() {
    this.loadWallet();

    // Refresh sync status
    setInterval(() => {
      this.state.store.dispatch(loadSyncStatus());
    }, 90000);
    this.state.store.dispatch(loadSyncStatus());
  }

  render() {

    let {store} = this.state;

    return (
      <Provider store={store}>
        <PriceProvider>
          <MainWrap store={store}/>
          <ReduxToastr
            timeOut={4000}
            newestOnTop={false}
            preventDuplicates
            position="bottom-right"
            transitionIn="fadeIn"
            transitionOut="fadeOut"
            progressBar />
        </PriceProvider>
      </Provider>
    );
  }
}

export default App;
