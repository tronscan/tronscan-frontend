import React, {Component} from 'react';
import {connect} from "react-redux";
import PrivateKeyAccess from "./PrivateKeyAccess";
import KeyStoreAccess from "./KeyStoreAccess";
import TrezorAccess from "./TrezorAccess";
import LedgerAccess from "./LedgerAccess";
import AddressAccess from "./AddressAccess";

class Index extends Component {

  constructor() {
    super();

    this.state = {
      active: null,
      pages: [
        {
          id: "address",
          label: "Address (Readonly)",
          icon: require("../../../images/private-key-1.png"),
        },
        {
          id: "pk",
          label: "Private Key",
          icon: require("../../../images/private-key-1.png"),
        },
        {
          id: "keystore",
          label: "Keystore File",
          icon: require("../../../images/private-key-file.png"),
        },
        {
          id: "ledger",
          label: "Ledger Nano S",
          icon: require("../../../images/ledger-icon.jpg"),
        },
        {
          id: "trezor",
          label: "Trezor",
          icon: require("../../../images/trezor-logo.png"),
        },
      ]
    };
  }

  setActivePage = (page) => {
    this.setState({
      active: page,
    });
  };

  componentDidMount() {

  }

  renderPage(pageId) {

    switch (pageId) {
      default:
        return (
          <div className="text-center">
            <h3 className="py-5 text-muted">Choose a method to access your wallet</h3>
          </div>
        );

      case "pk":
        return (
          <PrivateKeyAccess />
        );

      case "address":
        return (
          <AddressAccess />
        );

      case "keystore":
        return (
          <KeyStoreAccess />
        );

      case "trezor":
        return (
          <TrezorAccess />
        );

      case "ledger":
        return (
          <LedgerAccess />
        );
    }

  }

  render() {

    let {pages, active} = this.state;

    return (
      <main className="container header-overlap account-selector">
        <div className="card">
          <div className="card-header text-center">
            Access your wallet
          </div>
          <div className="row no-gutters">
            <ul className="nav flex-column col-md-3">
              {
                pages.map(page => (
                  <li className={"nav-item " + (page.id === active && "active")}>
                    <a className="nav-link" href="javascript:;" onClick={() => this.setActivePage(page.id)}>
                      {page.label}
                      <img className="icon" src={page.icon} />
                    </a>
                  </li>
                ))
              }
            </ul>
            <div className="col-md-9 account-page">
              {this.renderPage(active)}
            </div>
          </div>
        </div>
      </main>
    )
  }
}

const styles = {

};

function mapStateToProps(state) {
  return {
  };
}

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(Index)
