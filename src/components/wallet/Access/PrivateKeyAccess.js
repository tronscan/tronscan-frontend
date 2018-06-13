import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {login} from "../../../actions/app";
import {trim} from "lodash";
import {tu} from "../../../utils/i18n";

class PrivateKeyAccess extends Component {

  constructor() {
    super();

    this.state = {
      privateKey: "",
    }
  }

  isKeyValid = () => {
    let {privateKey} = this.state;

    if (!privateKey || privateKey.length === 0) {
      return false;
    }

    if (privateKey.length !== 64) {
      return false;
    }

    return true;
  };

  login = () => {
    let {privateKey} = this.state;
    let {history} = this.props;
    this.props.login(privateKey);

    history.push("/account");
  };

  render() {


    return (
      <div className="text-center p-3 mx-5">
        <h2>{tu("private_key")}</h2>
        <div className="form-group text-center mt-3">
          <input
            type="text"
            className="form-control"
            onChange={ev => this.setState({ privateKey: ev.target.value })}
            placeholder=""/>
        </div>
        <button className="btn btn-success btn-block"
                disabled={!this.isKeyValid()}
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
  login
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PrivateKeyAccess));
