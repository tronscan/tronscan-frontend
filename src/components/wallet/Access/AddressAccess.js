import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {loginWithAddressReadOnly} from "../../../actions/app";
import {trim} from "lodash";
import {tu} from "../../../utils/i18n";
import {saveWallet} from "../../../utils/storage";
import {isAddressValid} from "@tronscan/client/src/utils/crypto";

class AddressAccess extends Component {

  constructor() {
    super();

    this.state = {
      address: null,
    }
  }

  login = () => {
    let {address} = this.state;
    let {history} = this.props;
    this.props.loginWithAddressReadOnly(address);
    history.push("/account");

    saveWallet({
      type: 'readonly',
      address,
    });
  };

  isValid = () => {
    let {address} = this.state;

    return isAddressValid(address);
  };

  render() {

    return (
      <div className="text-center p-3 mx-auto mt-5" style={{ maxWidth: '400px' }}>
        {/*<h2>{tu("address")}</h2>*/}
        <div className="text-muted text-center">
          Open a readonly wallet for the given address
        </div>
        <div className="form-group text-center mt-3">
          <input
            type="text"
            className="form-control text-center"
            onChange={ev => this.setState({ address: ev.target.value })}
            placeholder="Address"/>
        </div>
        <button className="btn btn-success"
                disabled={!this.isValid()}
                onClick={this.login}>
          {tu("open_wallet")}
        </button>
      </div>
    )
  }
}

function mapStateToProps() {
  return {
  };
}

const mapDispatchToProps = {
  loginWithAddressReadOnly
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddressAccess));
