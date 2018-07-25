import React, {Component} from 'react';
import {connect} from "react-redux";
import PrivateKeyAccess from "./PrivateKeyAccess";
import KeyStoreAccess from "./KeyStoreAccess";
import TrezorAccess from "./TrezorAccess";
import LedgerAccess from "./LedgerAccess";
import AddressAccess from "./AddressAccess";

const tronLogo = require("../../../images/tron-banner-inverted.png");


class Index extends Component {

  constructor() {
    super();

    this.state = {
      active: null,
      pages: [
        // {
        //   id: "address",
        //   label: "Address",
        //   icon: require("../../../images/private-key-1.png"),
        // },
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
          label: "Ledger",
          icon: require("../../../images/ledger-icon.png"),
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
          <div className="text-center text-muted">
            <h3 className="py-5">Choose a method to access your wallet</h3>
            <i className="fa fa-arrow-left fa-3x" />

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
          <div className="text-center p-4 bg-dark" style={styles.headerWrap}>
            <img className="wallet-wizard-logo" src={tronLogo} style={styles.header} />
            <h3 style={{ color: '#bebebe'}} className="mt-3">Open Wallet</h3>
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
  header: {
    height: '100px',
  },
  headerWrap: {
    borderBottom: '5px solid #e9ecef'
  }
};

function mapStateToProps(state) {
  return {
  };
}

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(Index)
