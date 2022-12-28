import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

export default class LoadKeyFile extends React.Component {

  constructor() {
    super();
    this.state = {
      modal: this.renderInput(),
      password: "",
    };
  }

  renderInput = () => {

    let {onCancel} = this.props || {};

    return (
        <SweetAlert
            input
            showCancel
            inputType="password"
            cancelBtnBsStyle="default"
            title="Unlock KeyFile"
            placeHolder="Password"
            onCancel={onCancel}
            onConfirm={this.onConfirm}>
          Password
        </SweetAlert>
    );
  };


  onConfirm = (password) => {
    let {onConfirm} = this.props;

    onConfirm({
      password,
    })
  };

  render() {
    return this.state.modal;
  }
}
