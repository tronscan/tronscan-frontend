import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import TrezorConnect from "trezor-connect";
import {tu} from "../../../utils/i18n";
import {PulseLoader} from "react-spinners";
import {saveWallet} from "../../../utils/storage";
import {loadWalletFromTrezor} from "../../../actions/wallet";

class TrezorAccess extends Component {

  constructor() {
    super();

    this.state = {
      address: "",
      loading: true,
      connected: false,
    };
  }

  componentDidMount() {
    this.getAddress();
  }

  getAddress = async () => {
    let {payload, success} = await TrezorConnect.tronGetAddress({
      "path": "m/44'/195'/0'/0/0",
      "showOnTrezor": true
    });

    if (success) {
      this.setState({
        loading: false,
        connected: true,
        address: payload.address
      });
    }
  };

  openWallet = () => {
    let {address} = this.state;
    let {history} = this.props;
    this.props.loadWalletFromTrezor(address);
    history.push("/account");

    saveWallet({
      type: 'trezor',
      address,
    });
  };

  render() {

    let {loading, connected, address} = this.state;

    return (
      <div className="text-center pt-5 mx-5">
        <img src={require("../../../images/trezor-logo.png")} style={{ height: 65 }} />
        { loading &&
        <div className="mt-4">
          <div className="text-muted">
            Connect with your Trezor
          </div>
          <div className="my-3">
            <PulseLoader color="#343a40" loading={true} height={5} width={150} />
          </div>
        </div>
        }
        {
          connected &&
          <div className="my-3">
            <div className="text-center my-4">
              <b className="text-success">Ledger Connected</b><br/>
              {address}
            </div>
            <button className="btn btn-success mt-3"
                    onClick={this.openWallet}>
              {tu("open_wallet")}
            </button>
          </div>
        }

      </div>
    )
  }

}


function mapStateToProps(state) {
  return {
  };
}

const mapDispatchToProps = {
  loadWalletFromTrezor,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TrezorAccess));
