import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import LedgerDevice from "./LedgerBridge";
import {delay} from "../../utils/promises";
import {PulseLoader} from "react-spinners";
import {loginWithLedger} from "../../actions/app";
import {tu} from "../../utils/i18n";

@connect(
  null,
  {
    loginWithLedger
  }
)
@withRouter
export default class LedgerAccess extends Component {

  constructor() {
    super();
    this.state = {
      loading: false,
      connected: false,
      confirmed: false,
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
    // this.ledger.close();
  }

  checkForConnection = async () => {
    this.setState({ loading: true });

    while (this._isMounted) {

      let {connected, address} = await this.ledger.checkForConnection(true);

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
    let {history, onClose} = this.props;
    this.props.loginWithLedger(address);

    history.push("/account");

    onClose && onClose();
  };
  render() {
    let {loading, connected, address} = this.state;
    return (
      <div className="text-center pt-5 mx-5">
        <img src={require("./ledger-nano-s.png")} style={{ height: 65 }} />
        { loading &&
        <div className="mt-4">
          <div className="text-muted">
              {tu('open_tron_app_on_ledger')}
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
