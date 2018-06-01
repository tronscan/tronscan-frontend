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

  loadTransaction = async (hex) => {
    try {
      let {transaction} = await Client.readTransaction(hex);

      this.setState({
        transactionData: transaction,
      });
    } catch (e) {
      this.setState({
        modal: (
          <SweetAlert danger title="Transaction Load Error" onConfirm={this.hideModal}>
            Something went wrong while trying to load the transaction. Make sure the HEX is in a correct format
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
        }} />
      )
    });
  };

  broadcastTransaction = async (hex) => {
    let {success, code} = await Client.sendTransactionRaw(hex);
    if (success) {
      this.setState({
        modal: (
          <SweetAlert success title="Transaction Succes" onConfirm={this.hideModal}>
            Transaction successfully broadcasted to the network
          </SweetAlert>
        )
      });
    } else {
      this.setState({
        modal: (
          <SweetAlert danger title="Transaction Error" onConfirm={this.hideModal}>
            Something went wrong while trying to broadcast the transaction<br/>
            Code: {code}
          </SweetAlert>
        ),
      });
    }
  };

  broadcastTransactionModal = async () => {
    let {hex} = this.state;
    let {transaction} = await Client.readTransaction(hex);

    this.setState({
      modal: (
        <SweetAlert
          info
          showCancel
          confirmBtnText="Confirm Transaction"
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="default"
          title="Are you sure you want to send the transaction?"
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
      console.log(prevState.hex, hexUrl);
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
        <AddSignatureModalAsync transaction={hex} onClose={this.hideModal} />
      )
    });
  };

  render() {

    let {hex, transactionData, modal, showInput} = this.state;
    let {flags} = this.props;

    return (
      <main className="container header-overlap">
        {modal}
        {
          showInput &&
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">Transaction HEX</h5>
                <p className="text-center">
                  Here you can paste a transaction hex to inspect the contents of a transaction. The transaction
                  can then be broadcasted to the network
                </p>
                <textarea className="w-100 form-control"
                          rows="6"
                          value={hex}
                          onChange={ev => this.setState({hex: ev.target.value})}/>
                <div className="text-center p-3">
                  <button className="btn btn-primary"
                          disabled={trim(hex) === ""}
                          onClick={() => this.loadTransaction(hex)}>Load Transaction</button>
                </div>
                <hr/>
                <div className="text-center p-3">
                  <h5 className="card-title text-center">Transaction QR Code</h5>
                  <button className="btn btn-primary" onClick={() => this.scanTransaction()}>
                    Load Transaction from QR Code
                    <i className="fa fa-qrcode ml-2"/>
                  </button>
                </div>
              </div>
            </div>
        }
        {
          transactionData !== null &&
          <Fragment>
            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title text-center">Transaction</h5>
              </div>
              <table className="table">
                <Field label="timestamp">
                  <FormattedDate value={transactionData.timestamp / 1000000}/>&nbsp;
                  <FormattedTime value={transactionData.timestamp / 1000000}/>
                </Field>
                <Field label="contracts">
                  {transactionData.contracts.length}
                </Field>
                <Field label="signatures">
                  {transactionData.signatures.length}
                </Field>
              </table>
            </div>
            <div className="card mt-3">
              <div className="card-header text-center">
                {tu("Contracts")}
              </div>
              {
                transactionData.contracts.map(contract => (
                  <Contract contract={contract} />
                ))
              }
            </div>
            <div className="card mt-3">
              <div className="card-header text-center">
                {tu("Signatures")}
              </div>
              {
                transactionData.signatures.map(signature => (
                  <Signature signature={signature} />
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
                {tu("Broadcast Transaction to Network")}
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

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionViewer);
