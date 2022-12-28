import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import {pkToAddress} from "@tronscan/client/src/utils/crypto";
import {tu} from "../../utils/i18n";


export function confirmPKey(confirm, address, onCancel, setState, test) {

  let onInputChange = (value) => {
    if (value && value.length === 64) {
      this.privateKey.className = "form-control";
      if (pkToAddress(value) !== address)
        this.privateKey.className = "form-control is-invalid";
    }
    else {
      this.privateKey.className = "form-control is-invalid";
    }
    setState({privateKey: value});
    this.privateKey.value = value;
    test();
  }


  let reConfirm = () => {
    if (this.privateKey.value && this.privateKey.value.length === 64) {
      if (pkToAddress(this.privateKey.value) === address)
        confirm();
    }
  }

  return (
      <SweetAlert
          info
          showCancel
          cancelBtnText={tu("cancel")}
          confirmBtnText={tu("confirm")}
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="default"
          title={tu("confirm_private_key")}
          onConfirm={reConfirm}
          onCancel={onCancel}
          style={{marginLeft: '-240px', marginTop: '-195px'}}
      >
        <div className="form-group">
          <div className="input-group mb-3">
            <input type="text"
                   ref={ref => this.privateKey = ref}
                   onChange={(ev) => {
                     onInputChange(ev.target.value)
                   }}
                   className="form-control is-invalid"
            />
            <div className="invalid-feedback">
              {tu("fill_a_valid_private_key")}
            </div>
          </div>
        </div>
      </SweetAlert>
  )


}
