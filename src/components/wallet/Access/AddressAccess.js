import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {login, loginWithAddressReadOnly} from "../../../actions/app";
import {trim} from "lodash";
import {tu} from "../../../utils/i18n";
import {readFileContentsFromEvent} from "../../../services/file";
import SweetAlert from "react-bootstrap-sweetalert";
import {decryptString, validatePrivateKey} from "../../../services/secureKey";
import {bytesToString} from "@tronscan/client/src/utils/bytes";
import {pkToAddress} from "@tronscan/client/src/utils/crypto";
import {hexStr2byteArray} from "@tronscan/client/src/lib/code";

class AddressAccess extends Component {

  constructor() {
    super();

    this.state = {
      address: null,
    }
  }

  login = () => {
    let {address} = this.state;
    this.props.loginWithAddressReadOnly(address);
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


function mapStateToProps(state) {
  return {
  };
}

const mapDispatchToProps = {
  loginWithAddressReadOnly
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddressAccess));
