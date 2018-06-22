import React, {Fragment} from "react";
import ReactDOM from "react-dom";
import {Link} from "react-router-dom";
import {sampleSize} from "lodash";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ContextMenu, ContextMenuTrigger} from "react-contextmenu";
import QRImageCode from "./QRImageCode";
import SendModal from "../transfer/Send/SendModal";
import {tu,t} from "../../utils/i18n";
import {Truncate} from "./text";
import {CopyText} from "./Copy";

export const WitnessLink = ({address}) => (
  <Link to={`/witness/${address}`}>{address}</Link>
);

export const TokenLink = ({name, ...props}) => (
  <Link to={`/token/${encodeURI(name)}`} {...props}>{name}</Link>
);


export class AddressLink extends React.PureComponent {

  constructor() {
    super();

    this.state = {
      isOpen: false,
      showSend: false,
      modal: null,
    };
  }

  hideModal = () => {
    this.setState({ modal: null });
  };

  renderModal = () => {

    let {address} = this.props;

    this.setState({
      modal: (
        <Modal className="modal-dialog-centered animated zoomIn" fade={false} isOpen={true} toggle={this.hideModal} >
          <ModalHeader toggle={this.hideModal}/>
          <ModalBody className="text-center p-0" onClick={this.hideModal}>
            <QRImageCode value={address} size={500} style={{width: '100%'}} />
          </ModalBody>
        </Modal>
      )
    });
  };

  renderSend = () => {

    let {address} = this.props;

    this.setState({
      modal: (
        <SendModal
          to={address}
          isOpen={true}
          onClose={this.hideModal} />
      )
    });

  };

  renderContextMenu(random) {
    return (
      <ContextMenu id={random} style={{zIndex: 1040}}  className="dropdown-menu show">
        <Fragment>
          <a className="dropdown-item" href="javascript:" onClick={this.renderModal}>
            <i className="fas fa-qrcode mr-2"/>
            {tu("QR Code")}
          </a>
          <a className="dropdown-item" href="javascript:" onClick={this.renderSend}>
            <i className="fas fa-exchange-alt mr-2"/>
            {tu("Send tokens")}
          </a>
        </Fragment>
      </ContextMenu>
    );
  }

  render() {

    let {address = null, width = -1, children, showQrCode = false, includeCopy = false, truncate = true, className = "", ...props} = this.props;
    let {modal} = this.state;

    let style = {};

    if (width !== -1) {
      style.maxWidth = width;
    }

    let random = sampleSize('abcdefghijklmnopqrstufwxyzABCDEFGHIJKLMNOPQRSTUFWXYZ1234567890', 12).join('');

    let wrap = (
      <Fragment>
        <Link
          to={`/address/${address}`}
          style={style}
          className={"address-link text-nowrap " + className}
          {...props}>
          {children ? children : address}
        </Link>
        {
          includeCopy &&
          <CopyText text={address} className="ml-1"/>

        }
      </Fragment>
    );

    if (truncate) {
      wrap = (
        <Truncate>
          {wrap}
        </Truncate>
      )
    }

    return (
      <Fragment>
        {modal}
        <ContextMenuTrigger id={random}>
          {wrap}
        </ContextMenuTrigger>
        { showQrCode &&
          <a href="javascript:;" className="ml-1" onClick={this.renderModal}>
            <i className="fa fa-qrcode"/>
          </a>
        }
        {this.renderContextMenu(random)}
      </Fragment>
    )
  }
}

export class ExternalLink extends React.PureComponent {

  constructor() {
    super();

    this.state = {
      modal: null,
    };
  }

  hideModal = () => {
    this.setState({ modal: null });
  };

  onClickUrl = (ev) => {

    let {url} = this.props;

    ev.preventDefault();
    ev.stopPropagation();

    this.setState({
      modal: (
        <Modal className="modal-dialog-centered" fade={false} isOpen={true} toggle={this.hideModal} >
          <ModalHeader className="text-center">
            {tu("open_external_link")}
          </ModalHeader>
          <ModalBody className="text-center p-3" onClick={this.hideModal}>
            <span className="font-weight-bold text-truncate d-block">{url}</span> {t("no_official_tron_website")} &nbsp;
               {tu("private_key_untrusted_website_message_0")}
          </ModalBody>
          <ModalFooter>
            <a className="btn btn-primary"
               href={url}
               onClick={this.hideModal}
               target="_blank">{tu("continue_to_external_website")}</a>
            &nbsp;
            <Button color="secondary" onClick={this.hideModal}>{tu("cancel")}</Button>
          </ModalFooter>
        </Modal>
      )
    });
  };

  render() {

    let {url = '', children = null,  ...props} = this.props;
    let {modal} = this.state;

    return (
      <Fragment>
        {modal}
        <a href={url} onClick={this.onClickUrl} {...props}>{children || url}</a>
      </Fragment>
    )
  }
}

export const BlockHashLink = ({hash}) => (
  <Link to={`/block/${hash}`}>{hash}</Link>
);

export const TransactionHashLink = ({hash, children}) => (
  <Link to={`/transaction/${hash}`}>{children}</Link>
);

export const BlockNumberLink = ({number, children = null}) => {
  return (
    <Link to={`/block/${number}`}>
      {children || number}
    </Link>
  );
};
