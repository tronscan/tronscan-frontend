import React from "react";
import { injectIntl } from "react-intl";
import { tu } from "../../../utils/i18n";
import { Client } from "../../../services/api";
import { Collapse, Input, Form, Select } from 'antd';
import { connect } from "react-redux";
import { formatOutput, formatInput } from "../../../utils/readContract";
import SweetAlert from "react-bootstrap-sweetalert";
import TokenBalanceSelect from "../../common/TokenBalanceSelect";
import JSONTree from 'react-json-tree'
import SendMultiModal from "../../common/MultiModal/SendModal";
import { transactionMultiResultManager,transactionResultManagerByLedger } from "../../../utils/tron"
import xhr from "axios";
import MonacoEditor from "react-monaco-editor";
import {withTronWeb} from "../../../utils/tronWeb";
import {
  API_URL,
  IS_MAINNET,
  SUNWEBCONFIG,
  CONTRACT_LICENSES,
  CONTRACT_NODE_API,
  WARNING_VERSIONS
} from "../../../constants";

const { Panel } = Collapse;
// const { Option } = Select;

@connect(state => {
  return {
    account: state.app.account,
  };
})
@withTronWeb
class Code extends React.Component {
  constructor(props) {
    super(props);
    // this.tronWeb = new tronWeb({
    //   fullNode: 'https://api.trongrid.io',
    //   solidityNode: 'https://api.trongrid.io',
    //   eventServer: 'https://api.trongrid.io',
    // })
    this.state = {
      result: "",
      contract: "",
      submitValues: "",
      modal: null,
      tokenId: '',
      totalValue: 0,
      sendTokenDecimals:0,
      code:111
    };
  }

  async componentDidMount() {
    let { contractItem, address, account } = this.props;
    let { contract } = this.state;
    const { tronWeb, sunWeb } = this.props.account;
    if (account.isLoggedIn) {
      let addressHex = tronWeb.address.toHex(address);
      const tron = IS_MAINNET ? tronWeb : sunWeb.sidechain
      let initContract = await tron.contract([contractItem], addressHex);
      this.setState(
        {
          contract: initContract
        },
        () => {}
      );
    }
  }
  componentDidUpdate(prevProps, prevState) {
    // this.submitValueFormat()
  }


  isLoggedIn = () => {
    let { account, intl } = this.props;
    if (!account.isLoggedIn) {
      this.setState({
        modal: (
          <SweetAlert
            warning
            title={tu("not_signed_in")}
            confirmBtnText={intl.formatMessage({ id: "confirm" })}
            confirmBtnBsStyle="danger"
            onConfirm={() => this.setState({ modal: null })}
            style={{ marginLeft: "-240px", marginTop: "-195px" }}
          ></SweetAlert>
        )
      });
    }
    return account.isLoggedIn;
  };

  submitValueFormat(e) {
    // const { submitValues } = this.state
    const { contractItem } = this.props;
    const { getFieldsValue } = this.props.form;
    let submitValues;
    if (getFieldsValue().submitValues) {
      submitValues = getFieldsValue().submitValues;
    } else {
      submitValues = getFieldsValue();
    }
    // let submitValues = fieldata.submitValues
    // let submitValues = e.target.value
    // this.setState({
    //   submitValues: e.target.value
    // })
    let submitValueFormat = [];
    for (let i = 0; i < submitValues.length; i++) {
      let inputType = contractItem.inputs[i].type;
      let inputValue = submitValues[i];
      //bytes input
      submitValueFormat.push(formatInput(inputValue, inputType));
    }
    return submitValueFormat;
  }

  async Call() {
    let { contractItem, intl } = this.props;
    let { contract } = this.state;
    if (this.isLoggedIn()) {
      try {
        let retValue = await contract[contractItem.name](
          ...this.submitValueFormat()
        ).call();
        this.setState(
          {
            result: this.formatOutputs(retValue)
          },
          () => {}
        );
      } catch (e) {
        this.setState({
          result: JSON.stringify(e)
        });
        // this.setState({
        //   modal: <SweetAlert
        //     warning
        //     title={e}
        //     confirmBtnText={intl.formatMessage({ id: 'confirm' })}
        //     confirmBtnBsStyle="danger"
        //     onConfirm={() => this.setState({ modal: null })}
        //     style={{ marginLeft: '-240px', marginTop: '-195px' }}
        //   >
        //   </SweetAlert>
        // })
      }
    }
  }
  formatOutputs(retValue) {
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
    hideModal = () => {
        this.setState({modal: null});
    };
    MultiSendModal = () => {
        let {code} = this.state;
        this.setState({
            modal: (
                <SendMultiModal code={code} onClose={this.hideModal} onMultiSignSend={(permissionId, permissionTime, from) => this.MultiSend(permissionId, permissionTime, from)}/>
            )
        });
    };

  Mul (arg1, arg2) {
      let r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
      m = (r1.split(".")[1] ? r1.split(".")[1].length : 0) + (r2.split(".")[1] ? r2.split(".")[1].length : 0);
      resultVal = Number(r1.replace(".", "")) * Number(r2.replace(".", "")) / Math.pow(10, m);
      return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
  }
   MultiSend =  async(permissionId, permissionTime, from) => {
        const { tokenId, totalValue, contract ,sendTokenDecimals } = this.state;
        let { contractItem, address, account, intl } = this.props;
        const { tronWeb, sunWeb } = this.props.account;
        let tron;
        if(this.props.wallet.type === "ACCOUNT_LEDGER") {
           tron = IS_MAINNET ? this.props.tronWeb() : sunWeb.sidechain
        }else{
           tron = IS_MAINNET ?  tronWeb : sunWeb.sidechain
        }
        
        let selectorTypeArr = [];
        let selectorValueArr = this.submitValueFormat();
        let selectorArr = [];
        let transactionId;
        if(contractItem.inputs){
            for(let i = 0; i < contractItem.inputs.length; i++){
                selectorTypeArr.push(contractItem.inputs[i]['type'])
            }
        }
        if(selectorValueArr){
          for(let i = 0; i < selectorValueArr.length; i++){
              if(selectorValueArr[i] == 'undefined'){
                  selectorValueArr[i] = '';
              }
              if(selectorTypeArr[i] == 'address'){
                  selectorValueArr[i] = tron.address.toHex(selectorValueArr[i]);
              }
              selectorArr.push(
                    {type: selectorTypeArr[i], value: selectorValueArr[i]},
              )
            }
        }
        let selectorTypeStr = selectorTypeArr.join(',')
        let function_selector = contractItem.name + '(' + selectorTypeStr + ')';
        if (this.isLoggedIn()) {
            try {
                let options = {};
                if (!tokenId || tokenId == '_') {
                    options = { callValue: this.Mul(totalValue,Math.pow(10, sendTokenDecimals)) };
                } else {
                    options = {
                        tokenId: tokenId,
                        tokenValue: this.Mul(totalValue,Math.pow(10, sendTokenDecimals))
                    };
                }
                let unSignTransaction = await tron.transactionBuilder.triggerSmartContract(
                    tron.address.toHex(address),
                    function_selector,
                   // {'Permission_id':permissionId,...options},
                    {'permissionId': permissionId,...options},
                    selectorArr,
                    tron.address.toHex(from),
                );
                if (unSignTransaction.transaction !== undefined)
                    unSignTransaction = unSignTransaction.transaction;

                //get transaction parameter value to Hex
                let HexStr = Client.getTriggerSmartContractHexStr(unSignTransaction.raw_data.contract[0].parameter.value);
                //sign transaction
                let SignTransaction = await transactionMultiResultManager(unSignTransaction, tron, permissionId,permissionTime,HexStr);
                let { data } = await xhr.post("https://list.tronlink.org/api/wallet/multi/transaction", {
                    "address": account.address,
                    "transaction": SignTransaction,
                    "netType":"main_net",
                    "functionSelector":function_selector,
                });
                let code = data.code;
                if(code == 0){
                    this.setState({
                        modal: (
                            <SweetAlert success title={tu("transaction_create_successful")} onConfirm={this.hideModal}/>
                        )
                    });
                }else{
                    this.setState({
                        modal: (
                            <SweetAlert error title={tu("transaction_create_failed")} onConfirm={this.hideModal}/>
                        )
                    });
                }



                // let retValue = await this.getTxResult(SignTransaction);
                // this.setState({
                //     result: this.formatOutputs(retValue)
                // })

            } catch (e) {
                //console.log('e=======',e)
                if (e.error == "REVERT opcode executed") {
                    var res = e.output["contractResult"][0];
                    let result =
                        "REVERT opcode executed. " +
                        (res == ""
                            ? ""
                            : "Message: " +
                            tron
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

  async Send() {
    const { tokenId, totalValue, contract, sendTokenDecimals } = this.state;
    const { contractItem, intl } = this.props;
    const { tronWeb, sunWeb } = this.props.account;
    const tron = IS_MAINNET ? tronWeb : sunWeb.sidechain
    if (this.isLoggedIn()) {

      try {
        let options = {};
        if (!tokenId || tokenId == "_") {
          options = { callValue: this.Mul(totalValue,Math.pow(10, sendTokenDecimals))||0 }
        } else {
          options = {
            tokenId: tokenId,
            tokenValue: this.Mul(totalValue, Math.pow(10, sendTokenDecimals))
          };
        }
        let signedTransaction = await contract[contractItem.name](
          ...this.submitValueFormat()
        ).send(options);
        let retValue = await this.getTxResult(signedTransaction);
        this.setState({
          result: this.formatOutputs(retValue)
        });
      } catch (e) {
        if (e.error == "REVERT opcode executed") {
          var res = e.output["contractResult"][0];
          let result =
            "REVERT opcode executed. " +
            (res == ""
              ? ""
              : "Message: " +
              tron
                  .toUtf8(res.substring(res.length - 64, res.length))
                  .trim());
          this.setState({
            result: result
          });
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
          });
        }
      }
    }
  }
  async ledgerSend(){
    const { tokenId, totalValue, contract ,sendTokenDecimals } = this.state;
    let { contractItem, address, account, intl } = this.props;
    //const { tronWeb } = this.props.account;
    const tronWeb = this.props.tronWeb();
    let selectorTypeArr = [];
    let selectorValueArr = this.submitValueFormat();
    let selectorArr = [];
    let transactionId;
    if(contractItem.inputs){
        for(let i = 0; i < contractItem.inputs.length; i++){
            selectorTypeArr.push(contractItem.inputs[i]['type'])
        }
    }
    if(selectorValueArr){
      for(let i = 0; i < selectorValueArr.length; i++){
          if(selectorValueArr[i] == 'undefined'){
              selectorValueArr[i] = '';
          }
          if(selectorTypeArr[i] == 'address'){
              selectorValueArr[i] = tronWeb.address.toHex(selectorValueArr[i]);
          }
          selectorArr.push(
                {type: selectorTypeArr[i], value: selectorValueArr[i]},
          )
        }
    }
    let selectorTypeStr = selectorTypeArr.join(',')
    let function_selector = contractItem.name + '(' + selectorTypeStr + ')';
    if (this.isLoggedIn()) {
        try {
            let options = {};
            if (!tokenId || tokenId == '_') {
                options = { callValue: this.Mul(totalValue,Math.pow(10, sendTokenDecimals))||0 }
            } else {
                options = {
                    tokenId: tokenId,
                    tokenValue: this.Mul(totalValue,Math.pow(10, sendTokenDecimals))
                };
            }
            let unSignTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
                tronWeb.address.toHex(address),
                function_selector,
                {...options},
                selectorArr,
                tronWeb.address.toHex(account.address),
            );
            if (unSignTransaction.transaction !== undefined)
                unSignTransaction = unSignTransaction.transaction;
            unSignTransaction.extra = {
                to: '',
            }

            //get transaction parameter value to Hex
            let HexStr = Client.getTriggerSmartContractHexStr(unSignTransaction.raw_data.contract[0].parameter.value);

            
            //sign transaction
            let { broadcast,signedTransaction }= await transactionResultManagerByLedger(unSignTransaction,tronWeb);
            let retValue = false;
            if(!broadcast.result){
              retValue = false;
            
            }else{
              retValue = await this.getTxResult(signedTransaction.txID);
            }
           
            this.setState({
              result: this.formatOutputs(retValue)
            });
           
            // if(code == 0){
            //     this.setState({
            //         modal: (
            //             <SweetAlert success title={tu("transaction_create_successful")} onConfirm={this.hideModal}/>
            //         )
            //     });
            // }else{
            //     this.setState({
            //         modal: (
            //             <SweetAlert error title={tu("transaction_create_failed")} onConfirm={this.hideModal}/>
            //         )
            //     });
            // }


        } catch (e) {
            //console.log('e=======',e)
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

  sendClick(){
     const account = this.props.account;
     if(account.type==='ACCOUNT_LEDGER'){
       this.ledgerSend();
     }else{
       this.Send();
     }
  }
  getTxResult(txID) {
    let { contractItem, intl, address } = this.props;
    const { tronWeb, sunWeb } = this.props.account;
    const tron = IS_MAINNET ? tronWeb : sunWeb.sidechain
    return new Promise((reslove, reject) => {
      let checkResult = async function(txID) {
        const output = await tron.trx.getUnconfirmedTransactionInfo(txID);
        if (Object.keys(output).length <= 1 && !output.id) {
          return setTimeout(() => {
            checkResult(txID);
          }, 6000);
        }

        if (output.result && output.result == "FAILED") {
          return reject({
            error: tron.toUtf8(output.resMessage),
            transaction: txID,
            output
          });
        }
        if (!tron.utils.hasProperty(output, "contractResult")) {
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
        let decoded = tron.utils.abi.decodeParams(
          names,
          types,
          "0x" + output.contractResult[0]
        );
        if (decoded.length === 1) decoded = decoded[0];
        if(address == 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' && contractItem.name ==  "transfer"){
            return reslove(!decoded);
        }
        return reslove(decoded);

      };
      checkResult(txID);
    });
  }

  getChoiceItem(value) {
    this.setState({
      tokenId: value
    });
  }

  tokenBalanceSelectChange(name, decimals, balance) {
    this.setState({
      tokenId: name,
      sendTokenDecimals: decimals,
      sendTokenBalance: balance
    });
  }

  render() {
    let {
      choiceContractItem,
      contractInfoList,
      submitValues,
      modal,
      result,
      totalValue,
      tokenId
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    let { contractItem, index, currentTokens } = this.props;
    let contractList;
    if (contractItem.stateMutability == "Payable") {
      // Run these functions with Trx or Token
      contractList = (
        <div>
          <div className="select-block">
            <div className="select-line">
              {/*<Select style={{ width: 240 }} */}
              {/*onChange={(e) => this.getChoiceItem(e)} */}
              {/*placeholder="Select TRX or token to send">*/}
              {/*{*/}
              {/*currentTokens.map((val, key) => {*/}
              {/*return (*/}
              {/*<Option key={key} value={val.id}>{val.name}: {val.balance}</Option>*/}
              {/*)*/}
              {/*})*/}
              {/*}*/}
              {/*</Select>*/}
              <TokenBalanceSelect
                tokenBalanceSelectChange={(name, decimals, balance) => {
                  this.tokenBalanceSelectChange(name, decimals, balance);
                }}
              ></TokenBalanceSelect>
            </div>
            {tokenId ? (
              <Input
                style={{ width: "100%", display: "inline" }}
                placeholder="Amount token to Send"
                value={totalValue}
                onChange={e => this.setState({ totalValue: e.target.value })}
                className="mt-2"
              />
            ) : null}
          </div>
          <div className="d-flex">
              <div className="search-btn" onClick={() => this.sendClick()}>Send</div>
              {IS_MAINNET ? <div className="search-btn ml-2" onClick={() => this.MultiSendModal()} style={{width:'auto'}}>Multi Send</div> : ''}
          </div>

            {
                result && <JSONTree data={result}  theme={theme} invertTheme={true} hide/>
            }

        </div>
      );
    } else if (contractItem.stateMutability == "Nonpayable") {
      // Run these functions will consume Trx or Energy
      contractList = (
        <div>
            <div className="d-flex">
                <div className="search-btn" onClick={() => this.sendClick()}>Send</div>
                {IS_MAINNET ? <div className="search-btn ml-2" onClick={() => this.MultiSendModal()} style={{width:'auto'}}>Multi Send</div> : ''}
            </div>
            {
                result && <JSONTree data={result}  theme={theme} invertTheme={true}/>
            }

        </div>
      );
    } else {
      contractList = (
        <div>
          <div className="d-flex">
            <div className="search-btn" onClick={() => this.Call()}>
              Call
            </div>
          </div>
          {result && (
            <JSONTree data={result} theme={theme} invertTheme={true} />
          )}
        </div>
      );
    }

    return (
      <main className="read-container">
        {modal}
        <div>
          <Form>
            <Collapse
              defaultActiveKey={[`${index}`]}
              expandIconPosition="right"
            >
              <Panel header={index + 1 + "." + contractItem.name} key={index}>
                {contractItem.type != "Event" ? (
                  <div>
                    {contractItem.inputs ? (
                      <div>
                        {contractItem.inputs.map((val, key) => {
                          return (
                            // onChange={(e) => this.submitValueFormat(e)}
                            <div key={key} className="contract-item">
                              <Form.Item>
                                {getFieldDecorator(`submitValues[${key}]`)(
                                  <Input
                                    placeholder={val.name + "_" + val.type}
                                  />
                                )}
                              </Form.Item>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                    {contractList}
                  </div>
                ) : null}
              </Panel>
            </Collapse>
          </Form>
        </div>
      </main>
    );
  }
}
export default Form.create({ name: "contract_info" })(injectIntl(Code));

const theme = {
  scheme: "summerfruit",
  author: "christopher corley (http://cscorley.github.io/)",
  base00: "#151515",
  base01: "#202020",
  base02: "#303030",
  base03: "#505050",
  base04: "#B0B0B0",
  base05: "#D0D0D0",
  base06: "#E0E0E0",
  base07: "#FFFFFF",
  base08: "#FF0086",
  base09: "#FD8900",
  base0A: "#ABA800",
  base0B: "#00C918",
  base0C: "#1faaaa",
  base0D: "#3777E6",
  base0E: "#AD00A1",
  base0F: "#cc6633"
};
