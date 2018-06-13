import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {login, loginWithAddress} from "../../../actions/app";
import {trim} from "lodash";
import LedgerDevice from "../../../hw/ledger/LedgerDevice";
import {delay} from "../../../utils/promises";
import {tu} from "../../../utils/i18n";
import {Client} from "../../../services/api";
import LedgerSigner from "../../../hw/ledger/LedgerSigner";

class LedgerAccess extends Component {

  constructor() {
    super();

    this.state = {
      loading: false,
      connected: false,
      address: "",
    };

    this.ledger = new LedgerDevice();
  };

  componentDidMount() {
    console.log("MOUNTED");

    this._isMounted = true;
    this.checkForConnection();
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.ledger.close();
  }

  checkForConnection = async () => {

    this.setState({ loading: true });
    while (this._isMounted) {

      let {connected, address} = await this.ledger.checkForConnection();
      if (connected) {
        Client.setSigner(new LedgerSigner());
        this.setState({
          connected,
          address,
        });
        break;
      }

      await delay(300);
    }
    this.setState({ loading: false });
  };

  openWallet = () => {
    let {address} = this.state;
    let {history} = this.props;
    this.props.loginWithAddress(address);
    history.push("/account");
  };

  render() {

    let {loading, connected, address} = this.state;

    return (
      <div className="text-center p-3 mx-5">
        <h2>Ledger</h2>
        { loading && <div>Waiting for Ledger</div> }
        { address && <div>{address}</div> }
        { connected && <div>CONNECTED</div> }
        <br/>
        <br/>
        <br/>
        <button className="btn btn-success btn-block"
                disabled={!connected}
                onClick={this.openWallet}>
          {tu("open_wallet")}
        </button>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
  };
}

const mapDispatchToProps = {
  loginWithAddress,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LedgerAccess));
