/* eslint-disable no-restricted-globals */
import { connect } from "react-redux";
import React from "react";
import { find } from "lodash";
import TagForm from "./TagForm";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import { tu } from "../../../utils/i18n";
import { injectIntl } from "react-intl";
import "../../../styles/tags.scss";

@injectIntl
class AddTags extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modal: (
        <Modal
          backdrop="static"
          isOpen={true}
          toggle={this.hideModal}
          fade={false}
          className="modal-dialog-centered fiexd-none send-modal"
        >
          <ModalHeader className="text-center" toggle={this.hideModal}>
            {props.targetAddress
              ? tu("account_tags_edit_title")
              : tu("account_tags_add_title")}
          </ModalHeader>
          <ModalBody>
            <TagForm
              targetAddress={props.targetAddress}
              defaultAddress={props.defaultAddress}
              onloadTable={this.onloadTable}
            />
          </ModalBody>
        </Modal>
      )
    };
  }

  onloadTable = () => {
    this.props.onloadTableP();
    this.hideModal();
  };

  hideModal = () => {
    let { onClose } = this.props;
    onClose && onClose();
  };

  render() {
    let { intl, account } = this.props;

    let { modal } = this.state;

    if (!account.isLoggedIn) {
      return (
        <SweetAlert
          danger
          title={intl.formatMessage({ id: "not_login" })}
          onConfirm={this.hideModal}
        >
          {tu("login_first")}
        </SweetAlert>
      );
    }

    return modal;
  }
}

function mapStateToProps(state) {
  return {
    account: state.app.account,
    tokenBalances: state.account.tokens
  };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AddTags);
