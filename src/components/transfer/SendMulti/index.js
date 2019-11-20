/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import React from "react";
import * as qs from "query-string";
import {tu} from "../../../utils/i18n";
import {Link} from "react-router-dom";
import SendForm from "./SendForm";

class Send extends React.Component {

  constructor(props) {
    super(props);

    let queryParams = qs.parse(props.location.search);

    this.state = {
      to: queryParams.to || "",
    };
  }

  render() {

    let {account} = this.props;

    let {to} = this.state;

    if (!account.isLoggedIn) {
      return (
          <div>
            <div className="alert alert-warning">
              {tu("require_account_to_send")}
            </div>
            <p className="text-center">
              <Link to="/login">{tu("Go to login")}</Link>
            </p>
          </div>
      );
    }

    return (
        <main className="container-fluid pt-5 pb-5 bg-dark">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-sm-8 col-lg-5">
                <div className="card">
                  <div className="card-header text-center">
                    {tu("Send TRX")}
                  </div>
                  <div className="card-body">
                    <SendForm to={to}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
    )
  }
}

function mapStateToProps(state) {
  return {
    account: state.app.account,
    tokenBalances: state.account.tokens,
  };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Send)
