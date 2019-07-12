import React from "react";
import { injectIntl } from "react-intl";
import { tu, tv } from "../../../utils/i18n";
import { Collapse, Input, Button, Form, Select } from 'antd';
import { connect } from "react-redux";
import tronWeb from 'tronweb';
import { getTronExplorer, formatOutput, formatInput } from '../../../utils/readContract'
import SweetAlert from "react-bootstrap-sweetalert";


const { Panel } = Collapse;
const { Option } = Select;
@connect(
  state => {
    return {
      account: state.app.account
    }
  }
)
class Code extends React.Component {

  constructor(props) {
    super(props);
    // this.tronWeb = new tronWeb({
    //   fullNode: 'https://api.trongrid.io',
    //   solidityNode: 'https://api.trongrid.io',
    //   eventServer: 'https://api.trongrid.io',
    //   // privateKey: 'BBB063B5C94DC51DD028484B76984F8933DCF195C4476F2285CF3A256CB4FC15'
    // })
    this.state = {
      result: '',
      contract: '',
      submitValues: '',
      modal: null,
      tokenId: '',
      totalValue: ''
    };
  }

  async componentDidMount() {
    let { contractItem, address, account } = this.props;
    let { contract } = this.state
    const { tronWeb } = this.props.account;
    if ( account.isLoggedIn ) {
      let addressHex = tronWeb.address.toHex(address)
      
      let initContract = await tronWeb.contract([contractItem], addressHex)
      this.setState({
        contract: initContract
      }, () => {
          // console.log('contract: ', this.state.contract);
      })
    }
  }
  componentDidUpdate(prevProps, prevState) {
    // this.submitValueFormat()
  }

  isLoggedIn = () => {
    let { account, intl } = this.props;
    if (!account.isLoggedIn) {
      this.setState({
        modal: <SweetAlert
          warning
          title={tu("not_signed_in")}
          confirmBtnText={intl.formatMessage({ id: 'confirm' })}
          confirmBtnBsStyle="danger"
          onConfirm={() => this.setState({ modal: null })}
          style={{ marginLeft: '-240px', marginTop: '-195px' }}
        >
        </SweetAlert>
      })
    }
    return account.isLoggedIn;
  };

  submitValueFormat(e) {
    // const { submitValues } = this.state
    const { contractItem } = this.props;
    const { getFieldsValue } = this.props.form
    let submitValues = getFieldsValue().submitValues
    console.log('submitValues: ', submitValues);
    // let submitValues = fieldata.submitValues
    // let submitValues = e.target.value
    // this.setState({
    //   submitValues: e.target.value
    // })
    let submitValueFormat = [];
    for (let i = 0 ; i < submitValues.length; i++ ) {
      let inputType = contractItem.inputs[i].type;
      console.log('inputType: ', inputType);
      let inputValue = submitValues[i];
      console.log('inputValue: ', inputValue);
      //bytes input
      submitValueFormat.push(formatInput(inputValue, inputType));
    }
    return submitValueFormat;
  }
  // submitValueFormat: function() {
  //     let submitValueFormat = [];
  //     console.log('this.submitValues: ', this.submitValues);
  //     for (let i in this.submitValues) {
  //       let inputType = this.entry.inputs[i].type;
  //       let inputValue = this.submitValues[i];
  //       //bytes input
  //       submitValueFormat.push(formatInput(inputValue, inputType));
        
  //     }
  //     console.log('submitValueFormat: ', submitValueFormat);
  //     return submitValueFormat;
  //   },


  async Call() {
    let { contractItem, intl } = this.props;
    let { contract } = this.state
    if ( this.isLoggedIn() ) {
      try {

        let retValue = await contract[contractItem.name](
          ...this.submitValueFormat()
        ).call();
        this.setState({
          result: this.formatOutputs(retValue)
        })
      } catch (e) {
        console.log("Error",e);

        this.setState({
          modal: <SweetAlert
            warning
            title={e}
            confirmBtnText={intl.formatMessage({ id: 'confirm' })}
            confirmBtnBsStyle="danger"
            onConfirm={() => this.setState({ modal: null })}
            style={{ marginLeft: '-240px', marginTop: '-195px' }}
          >
          </SweetAlert>
        })
      }
    }
  }
  formatOutputs (retValue) {
    let { contractItem } = this.props;
    if (contractItem.outputs != undefined && contractItem.outputs.length > 1) {
      return contractItem.outputs.map((output, key) => {
        if (output.name != undefined) {
          return (
            output.name +
            ": " +
            formatOutput(retValue[output.name], output.type)
          );
        }
        return formatOutput(retValue[key], output.type);
      });
    } else if (
      contractItem.outputs != undefined &&
      contractItem.outputs.length == 1
    ) {
      if (contractItem.outputs[0].name != undefined) {
        return formatOutput(
          retValue[contractItem.outputs[0].name],
          contractItem.outputs[0].type
        );
      }
      return formatOutput(retValue, contractItem.outputs[0].type);
      
    } else {
      return "No value return";
    }
  }

  async Send () {
    const { tokenId, totalValue, contract } = this.state
    console.log('totalValue: ', totalValue);
    console.log('tokenId: ', tokenId);
    const { contractItem, intl } = this.props;
    const { tronWeb } = this.props.account;
    if (this.isLoggedIn()) {
      try {
        console.log('this.submitValueFormat(): ', this.submitValueFormat());
        let options = {};
          if (!(tokenId) || tokenId == '_') {
            options = { callValue: totalValue };
          } else {
            options = { tokenId: tokenId, tokenValue: totalValue };
          }
        let signedTransaction = await contract[contractItem.name](
          ...this.submitValueFormat()
        ).send(options)
        let retValue = await this.getTxResult(signedTransaction);
        console.log('retValue: ', retValue);
        this.setState({
          result: this.formatOutputs(retValue)
        })
      } catch (e) {
        console.log(e);
        if (e.error == "REVERT opcode executed") {
          var res = e.output["contractResult"][0];
          let result =
            "REVERT opcode executed. " +
            (res == ""
              ? ""
              : "Message: " +
              tronWeb
                .toUtf8(res.substring(res.length - 64, res.length))
                .trim());
          this.setState({
            result: result
          })
        } else {
          this.setState({
            result: JSON.stringify(e)
            // modal: <SweetAlert
            //   warning
            //   title={e}
            //   confirmBtnText={intl.formatMessage({ id: 'confirm' })}
            //   confirmBtnBsStyle="danger"
            //   onConfirm={() => this.setState({ modal: null })}
            //   style={{ marginLeft: '-240px', marginTop: '-195px' }}
            // >
            // </SweetAlert>
          })
        }
      }
    }
  }
  getTxResult (txID) {
    let { contractItem, intl } = this.props;
    console.log('contractItem: ', contractItem);
    const { tronWeb } = this.props.account;
    return new Promise((reslove, reject) => {
      let checkResult = async function (txID) {
        const output = await tronWeb.trx.getTransactionInfo(txID);
        console.log('output: ', output);
        if (!Object.keys(output).length) {
          return setTimeout(() => {
            checkResult(txID);
          }, 3000);
        }

        if (output.result && output.result == "FAILED") {
          return reject({
            error: tronWeb.toUtf8(output.resMessage),
            transaction: txID,
            output
          });
        }

        if (!tronWeb.utils.hasProperty(output, "contractResult")) {
          return reject({
            error: "Failed to execute: " + JSON.stringify(output, null, 2),
            transaction: txID,
            output
          });
        }
        if (contractItem.outputs == undefined) {
          return reslove(0);
        }
        const names = contractItem.outputs
          .map(({ name }) => name)
          .filter(name => !!name);
        const types = contractItem.outputs.map(({ type }) => type);
        let decoded = window.tronWeb.utils.abi.decodeParams(
          names,
          types,
          "0x" + output.contractResult[0]
        );
        if (decoded.length === 1) decoded = decoded[0];
        return reslove(decoded);
      };
      checkResult(txID);
    });
  }

  getChoiceItem(value) {
    this.setState({
      tokenId: value
    })
  }


  render() {
    let { choiceContractItem, contractInfoList, submitValues, modal, result, totalValue, tokenId } = this.state;
    const { getFieldDecorator } = this.props.form
    let { contractItem, index, currentTokens } = this.props;
    let contractList
    if (contractItem.stateMutability == 'Payable') {
      // Run these functions with Trx or Token
      contractList = (
        <div>
          <div className="select-block">
            <div className="select-line">
              <Select style={{ width: 240 }} 
                onChange={(e) => this.getChoiceItem(e)} 
                placeholder="Select TRX or token to send">
                {
                  currentTokens.map((val, key) => {
                    return (
                      <Option key={key} value={val.id}>{val.name}: {val.balance}</Option>
                    )
                  })
                }
              </Select>
            </div>
            {
              tokenId ? 
                <Input style={{ width: 200, display: 'inline' }}
                  placeholder="Amount token to Send"
                  value={totalValue}
                  onChange={(e) => this.setState({ totalValue: e.target.value })} />
                : null
            }
            
          </div>
          <div className="search-btn" onClick={() => this.Send()}>Send</div>
          <div>{result}</div>
        </div>
      )
    } else if (contractItem.stateMutability == 'Nonpayable') {
      // Run these functions will consume Trx or Energy
      contractList = (
        <div>
          <div className="search-btn" onClick={() => this.Send()}>Send</div>
          <div>{result}</div>
        </div>
      )
    } else {
      contractList = (
        <div>
          <div className="search-btn" onClick={() => this.Call()}>Call</div>
          <div>{result}</div>
        </div>
      )
      
    }

    return (
      <main className="read-container">
        {modal}
        <div>
          <Form>
            <Collapse defaultActiveKey={[`${index}`]} expandIconPosition="right">
              <Panel header={index+1 +'.' + contractItem.name} key={index}>
                {
                  contractItem.type != 'Event' ?
                    <div>
                      {contractItem.inputs ?
                        <div>
                          {
                            contractItem.inputs.map((val, key) => {
                              return (
                                // onChange={(e) => this.submitValueFormat(e)}   
                                <div key={key} className="contract-item">
                                <Form.Item>
                                    {getFieldDecorator(`submitValues[${key}]`)(
                                    <Input placeholder={val.name + '_' + val.type} />
                                  )}
                                </Form.Item>
                                </div>
                              )
                            })
                          }
                        </div>
                        : null
                      }
                      {contractList}
                    </div>
                  : null
                }
              </Panel>
            </Collapse>
          </Form>
        </div>
      </main>

    )
  }
}
export default Form.create({ name: 'contract_info' })(injectIntl(Code));