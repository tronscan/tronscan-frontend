import React, {Component, Fragment} from 'react';
import {tu} from "../../../utils/i18n";
import {FormattedDate, FormattedTime} from "react-intl";
import {Client} from "../../../services/api";
import {getQueryParam} from "../../../utils/url";
import SweetAlert from "react-bootstrap-sweetalert";
import {trim} from "lodash";
import Contract from "./Contract";
import Field from "./Field";
import Signature from "./Signature";
import {AddSignatureModalAsync} from "./async";
import {connect} from "react-redux";
import ScanSignatureModal from "./ScanTransactionModal";


class TransactionViewer extends Component {

  constructor(props) {
    super(props);

    let hexUrl = getQueryParam(props.location, "hex", "");
    this.state = {
      hex: hexUrl,
      showInput: hexUrl === "",
      transactionData: null,
      modal: null,
    };
  }

  componentDidMount() {
    let {hex} = this.state;
    if (hex) {
      this.loadTransaction(hex);
    }
  }

  hideModal = () => {
    this.setState({
      modal: null,
    });
  };
  setHex = (hexUrl) =>{
      this.setState({
          hex: hexUrl,
      });
  }

  loadTransaction = async (hex) => {
    try {
      let {transaction} = await Client.readTransactionNew(hex);
      if(!transaction){
          this.setState({
              modal: (
                  <SweetAlert danger title={tu("transaction_load_error")} onConfirm={this.hideModal}>
                      {tu("transaction_load_error_message")}
                  </SweetAlert>
              )
          });
      }else{
          this.setState({
              transactionData: transaction,
          });
      }
    } catch (e) {
      this.setState({
        modal: (
            <SweetAlert danger title={tu("transaction_load_error")} onConfirm={this.hideModal}>
              {tu("transaction_load_error_message")}
            </SweetAlert>
        )
      });
    }
  };

  scanTransaction = async () => {

    this.setState({
      modal: (
          <ScanSignatureModal onClose={this.hideModal} onConfirm={({code}) => {
            this.loadTransaction(code);
            this.hideModal();
            this.setHex(code);
          }}/>
      )
    });
  };

  broadcastTransaction = async (hex) => {
    let {success, code} = await Client.sendTransactionRaw(hex);
    if (success) {
      this.setState({
        modal: (
            <SweetAlert success title={tu("transaction_success")} onConfirm={this.hideModal}>
              {tu("transaction_success_message")}
            </SweetAlert>
        )
      });
    } else {
      this.setState({
        modal: (
            <SweetAlert danger title={tu("transaction_error")} onConfirm={this.hideModal}>
              {tu("transaction_error_message")}<br/>
              Code: {code}
            </SweetAlert>
        ),
      });
    }
  };

  broadcastTransactionModal = async () => {
    let {hex} = this.state;
    let {transaction} = await Client.readTransactionNew(hex);
    this.setState({
      modal: (
          <SweetAlert
              info
              showCancel
              confirmBtnText={tu("confirm_transaction")}
              confirmBtnBsStyle="success"
              cancelBtnBsStyle="default"
              title={tu("confirm_transaction_message")}
              onConfirm={() => this.broadcastTransaction(hex)}
              onCancel={this.hideModal}
          >
          </SweetAlert>
      )
    });

    this.setState({
      transactionData: transaction,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    let hexUrl = getQueryParam(this.props.location, "hex", "");


    if (hexUrl !== "" && (prevState.hex !== hexUrl)) {
      this.loadTransaction(hexUrl);

      this.setState({
        hex: hexUrl,
      });
    }
  }

  addSignature = () => {

    let {hex} = this.state;

    this.setState({
      modal: (
          <AddSignatureModalAsync transaction={hex} onClose={this.hideModal}/>
      )
    });
  };

  render() {

    let {hex, transactionData, modal, showInput} = this.state;
    let {flags} = this.props;
    return (
        <main className="container header-overlap _transactionViewer">
          {modal}
          {
            showInput &&
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">{tu("transaction")} HEX</h5>
                <p className="text-center">
                  {tu("info_tx_viewer")}
                </p>
                <textarea className="w-100 form-control"
                          rows="6"
                          value={hex}
                          onChange={ev => this.setState({hex: ev.target.value})}/>
                <div className="text-center _load_tx">
                  <button className="btn btn-primary"
                          disabled={trim(hex) === ""}
                          onClick={() => this.loadTransaction(hex)}>{tu("load_tx")}</button>
                </div>
                <hr/>
                <div className="text-center p-3 _qrcode">
                  <h5 className="card-title text-center">{tu("tx_qrcode")}</h5>
                  <button className="btn btn-primary" onClick={() => this.scanTransaction()}>
                    {tu("load_tx_qrcode")}
                    <i className="fa fa-qrcode ml-2"/>
                  </button>
                </div>
              </div>
            </div>
          }
          {
            transactionData &&
            <Fragment>
              <div className="card mt-3">
                <div className="card-body">
                  <h5 className="card-title text-center">Transaction</h5>
                </div>
                <div className="table-responsive">
                  <table className="table">
                    <tbody>
                      <Field label="timestamp">
                        <FormattedDate value={transactionData.timestamp }/>&nbsp;
                        <FormattedTime value={transactionData.timestamp }  hour='numeric' minute="numeric" second='numeric' hour12={false}/>
                      </Field>
                      <Field label="contracts">
                        {transactionData.contracts.length}
                      </Field>
                      <Field label="signatures">
                        {transactionData.signatures.length}
                      </Field>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card mt-3">
                <div className="card-header text-center">
                  {tu("Contracts")}
                </div>
                {
                  transactionData.contracts.map((contract,index) => (
                      <Contract key={index} contract={contract}/>
                  ))
                }
              </div>
              <div className="card mt-3">
                <div className="card-header text-center">
                  {tu("Signatures")}
                </div>
                {
                  transactionData.signatures.map(signature => (
                      <Signature signature={signature}/>
                  ))
                }
                {/*<div className="card-body text-center">*/}
                {/*<button className="btn btn-primary" onClick={this.addSignature}>*/}
                {/*<i className="fas fa-plus-circle mr-2"/>*/}
                {/*Add Signature*/}
                {/*</button>*/}
                {/*</div>*/}
              </div>
              <div className="card mt-3 mb-5">
                <button className="btn btn-success btn-lg" onClick={this.broadcastTransactionModal}>
                  {tu("broadcast_transaction_to_network")}
                </button>
              </div>
            </Fragment>
          }
        </main>
    );
  }
}


function mapStateToProps(state) {
  return {
    flags: state.app.flags,
  };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionViewer);
