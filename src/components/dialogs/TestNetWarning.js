/* eslint-disable no-undef */
import React from "react";
import {tu} from "../../utils/i18n";



export default class TestNetWarning extends React.Component {

  constructor() {
    super();

    this.state = {
      visible: false,
    };
  }

  componentDidUpdate({visible}) {
    //   console.log("TOGGLE", visible, this.state);
    // if (this.state.visible !== visible) {
    //   if (visible) {
    //     $(this.$ref).modal('show');
    //   } else {
    //     $(this.$ref).modal('hide');
    //   }
    //
    //   this.setState({ visible });
    // }
  }

  render() {

    let {visible, onClose} = this.props;

    return (
      <React.Fragment>
        <div className="modal show" ref={(el) => this.$ref = el} style={{ display: visible ? 'block' : 'none'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <p>{tu("dear_users,")}</p>
                <p>{tu("the_lunch_test")}</p>
                <p>
                  <span className="font-weight-bold text-danger pr-1">
                    {tu("plese_keep_in_mind")}
                  </span>
                 {tu("trx_for_testing")}
                </p>
                <p className="text-right">
                  {tu("tron_foundation")}
                </p>
              </div>
              <div className="modal-footer justify-content-center">
                <button type="button" className="btn btn-danger" onClick={onClose}>
                  {tu("ok")}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop show" style={{ display: visible ? 'block' : 'none'}}/>
      </React.Fragment>
    )
  }

}
