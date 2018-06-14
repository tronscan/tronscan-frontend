import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {loginWithAddressReadOnly} from "../../../actions/app";
import {trim} from "lodash";
import {tu} from "../../../utils/i18n";
import {saveWallet} from "../../../utils/storage";

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

  render() {

    return (
      <div className="text-center p-3 mx-5">
        <h2>{tu("address_only")}</h2>
        <div className="form-group text-center mt-3">
          <input
            type="text"
            className="form-control"
            onChange={ev => this.setState({ address: ev.target.value })}
            placeholder=""/>
        </div>
        <button className="btn btn-success btn-block"
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
