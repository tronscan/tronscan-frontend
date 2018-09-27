import React, {Fragment} from "react";
import {ONE_TRX} from "../../constants";
import {AddressLink} from "../common/Links";
import {getNotifyPermission, requestNotifyPermissions, sendNotification} from "../../services/notifications";
import SweetAlert from "react-bootstrap-sweetalert";
import {channel} from "../../services/api";
import {connect} from "react-redux";
import {reloadWallet} from "../../actions/wallet";
import {tu} from "../../utils/i18n";

function Notification({account, notification}) {

  switch (notification.type) {
    case "transfer":

      let amount = notification.amount;
      if (notification.tokenName.toUpperCase() === "TRX") {
        amount = amount / ONE_TRX;
      }

      if (notification.transferFromAddress === account.address) {
        return (
            <li key={notification.id} className="dropdown-item p-1">
              <div className="media">
                <i className="fa fa-sort-up fa-2x text-danger m-2"/>
                <div className="media-body">
                  <h6 className="m-0 text-danger">Send {amount} {notification.tokenName}</h6>
                  to <AddressLink address={notification.transferToAddress} truncate={false}/>
                </div>
              </div>
            </li>
        );
      } else if (notification.transferToAddress === account.address) {
        return (
            <li key={notification.id} className="dropdown-item p-1">
              <div className="media">
                <i className="fa fa-sort-down fa-2x text-success m-2"/>
                <div className="media-body">
                  <h6 className="m-0 text-success">Received {amount} {notification.tokenName}</h6>
                  from <AddressLink address={notification.transferFromAddress} truncate={false}/>
                </div>
              </div>
            </li>
        );
      }
      break;

    case "vote":

      return (
          <li key={notification.id} className="dropdown-item p-1">
            <div className="media">
              <i className="fa fa-bullhorn fa-2x text-primary m-2"/>
              <div className="media-body">
                <h6 className="m-0 text-primary">Received {notification.votes} votes</h6>
                from <AddressLink address={notification.voterAddress} truncate={false}/>
              </div>
            </div>
          </li>
      );
  }

  return null;
}

class Notifications extends React.Component {

  constructor() {
    super();

    this.id = 0;

    this.state = {
      modal: null,
      notifications: [],
    };
  }

  componentDidMount() {
    // this.reconnect();
  }

  componentDidUpdate(prevProps) {
    let {wallet} = this.props;
    if (prevProps.wallet.current === null || wallet.current.address !== prevProps.wallet.current.address) {
      // this.reconnect();
    }
  }

  reconnect() {
    let {wallet} = this.props;

    this.listener && this.listener.close();

    if (!wallet.isOpen) {
      return;
    }

    // this.listener = channel("/address-" + wallet.current.address);
    // this.listener.on("transfer", trx => {

    //   let amount = trx.amount;
    //   if (trx.tokenName.toUpperCase() === "TRX") {
    //     amount = amount / ONE_TRX;
    //   }

    //   if (trx.transferToAddress === wallet.current.address) {
    //     sendNotification(`Received ${amount} ${trx.tokenName} from ${trx.transferFromAddress}`, {
    //       icon: require("../../images/tron-logo.jpg")
    //     });
    //   }

    //   this.setState(state => ({
    //     notifications: [{
    //       id: this.id++,
    //       type: "transfer",
    //       ...trx,
    //     }, ...state.notifications.slice(0, 9)]
    //   }));
    //   this.props.reloadWallet();
    // });


    // this.listener.on("vote", vote => {
    //   if (vote.candidateAddress === wallet.current.address) {
    //     sendNotification(`Received ${vote.votes} votes from ${vote.voterAddress}`, {
    //       icon: require("../../images/tron-logo.jpg")
    //     });
    //     this.setState(state => ({
    //       notifications: [{
    //         id: this.id++,
    //         type: "vote",
    //         ...vote,
    //       }, ...state.notifications.slice(0, 9)]
    //     }));
    //   }
    // });

    // this.listener.on("witness-create", event => {
    //   this.props.reloadWallet();
    // });
  }

  componentWillUnmount() {
    this.listener && this.listener.close();
  }

  enableDesktopNotifications = async () => {
    if (await requestNotifyPermissions()) {
      this.setState({
        modal: (
            <SweetAlert success title={tu("notifications_enabled")} onConfirm={() => this.setState({modal: null,})}>
              {tu("desktop_notification_enabled")}
            </SweetAlert>
        )
      });
    }
  };

  shouldRequestForPermission() {
    return getNotifyPermission() === "default";
  }

  render() {

    let {wallet} = this.props;
    let {modal, notifications = []} = this.state;

    return (
        <li className="nav-item dropdown">
          {modal}
          <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="javascript:">
            <i className="fa fa-bell mr-2"/>
            {
              notifications.length > 0 &&
              <span className="badge badge-notify">{notifications.length}</span>
            }
          </a>
          <ul className="dropdown-menu dropdown-menu-right wallet-notifications">
            {
              notifications.length === 0 &&
              <h6 className="dropdown-header text-center">{tu("no_notifications")}</h6>
            }
            {
              notifications.length > 0 &&
              <Fragment>
                {
                  notifications.map(notification => (
                      <Notification key={notification.id} account={wallet.current} notification={notification}/>
                  ))
                }
              </Fragment>
            }
            {
              this.shouldRequestForPermission() &&
              <a href="javascript:;" className="dropdown-item" onClick={this.enableDesktopNotifications}>
                {tu("enable_desktop_notifications")}
              </a>
            }
          </ul>
        </li>
    );
  }
}

const mapDispatchToProps = {
  reloadWallet,
};

export default connect(null, mapDispatchToProps)(Notifications)
