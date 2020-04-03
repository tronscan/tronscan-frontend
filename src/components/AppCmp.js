import React, {Component} from 'react';
import {Provider} from "react-redux";
import {store} from "../store";
import MainWrap from "./MainWrap";
import {PriceProvider} from "./common/Price";
import Lockr from "lockr";
import {loadSyncStatus, login, loginWithAddress} from "../actions/app";

import ReduxToastr from 'react-redux-toastr'

class AppCmp extends Component {

  constructor() {
    super();
    this.state = {
      loading: true,
      store,
    };
  }

  componentDidMount() {
    let accountKey = Lockr.get("account_key");
    if (accountKey !== undefined) {
      this.state.store.dispatch(login(accountKey));
    }
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
                progressBar
            />
          </PriceProvider>
        </Provider>
    )
  }
}

export default AppCmp;
