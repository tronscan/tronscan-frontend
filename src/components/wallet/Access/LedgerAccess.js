import React, {Component, Fragment} from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {trim} from "lodash";
import LedgerDevice from "../../../hw/ledger/LedgerDevice";
import {delay} from "../../../utils/promises";
import {tu} from "../../../utils/i18n";
import {saveWallet} from "../../../utils/storage";
import {loadWalletFromLedger} from "../../../actions/wallet";
import {BarLoader, PulseLoader} from "react-spinners";

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
    this.props.loadWalletFromLedger(address);
    history.push("/account");

    saveWallet({
      type: 'ledger',
      address,
    });
  };

  render() {

    let {loading, connected, address} = this.state;

    return (
      <div className="text-center pt-5 mx-5">
        <img src={require("../../../images/ledger-nano-s.png")} style={{ height: 65 }} />
        { loading &&
          <div className="mt-4">
            <div className="text-muted">
              Open the Tron app on your Ledger
            </div>
            <div className="my-3">
              <PulseLoader color="#343a40" loading={true} height={5} width={150} />
            </div>
          </div>
        }
        {
          connected &&
          <Fragment>
            <div className="text-center my-4">
              <b className="text-success">Ledger Connected</b><br/>
              {address}
            </div>
            <button className="btn btn-success mt-3"
                    onClick={this.openWallet}>
              {tu("open_wallet")}
            </button>
          </Fragment>
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
  loadWalletFromLedger,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LedgerAccess));
