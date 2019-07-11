import React from "react";
import {CopyText} from "../../common/Copy";
import {tu, tv} from "../../../utils/i18n";
import {Client} from "../../../services/api";
import xhr from "axios/index";
import {API_URL} from "../../../constants";
import { AddressLink} from "../../common/Links";
import {TronLoader} from "../../common/loaders";
import { Radio } from 'antd';
import ContractInfo from './ContractInfo'
import EntryContract from './EntryContract'
import tronWeb from 'tronweb';
import { connect } from "react-redux";

@connect(
  state => {
    return {
      account: state.app.account
    }
  }
)

export default class Code extends React.Component {

  constructor(props) {
    super(props);
    // https://api.shasta.trongrid.io   https://api.trongrid.io
    this.tronWeb = new tronWeb({
      fullNode: 'https://api.shasta.trongrid.io',
      solidityNode: 'https://api.shasta.trongrid.io',
      eventServer: 'https://api.shasta.trongrid.io',
    })
    this.state = {
      loading: true,
      choiceContractItem: 'code',
      contractInfoList: '',
      viewContractList: [],
      payableContractList: [],
      nonePayableContractList: [],
      eventContractList: [],
      currentTokens: [],
      contractVerifyState: true
    };
  }

  async componentDidMount() {
    const { contractVerifyState } = this.state
    // await this.getContractInfos()
    this.getContractVerifyStatus()
    // this.getContractTokenList()
    // this.viewFuntions()
    // this.payableFuntions()
    // this.nonePayableFuntions()
    
  }
  async getContractVerifyStatus () {
    let { filter } = this.props;
    let { data } = await xhr.post(`http://18.219.114.60:9016/v1/api/contract/info`, {
      "contractAddress": filter.address,
    }).catch(function (e) {
      console.log(e)
      let errorData = [{
        type: "error",
        content: `Compiled error: ${e.toString()}`
      }]
      console.log('errorData: ', errorData);
      // error = errorData.concat(CompileStatus)

    });
    // console.log('data: ', data.data);
    let dataInfo = data.data
    if (data.data.status === 3 || data.data.status === 1) {
      this.setState({
        contractVerifyState: false,
        loading: false
      }, async() => {
          // this.getContractTokenList()
          await this.getContractInfos()
          // this.viewFuntions()
          // this.payableFuntions()
          // this.nonePayableFuntions()
      })
    } else {
      let infoObj
      let abi = JSON.parse(dataInfo.abi)
      console.log('abi: ', abi);
      infoObj = {
        interfaceAbi: abi || '',
        name: dataInfo.contract_name || '',
        bytecode: dataInfo.byte_code || '',
        contractCode: dataInfo.contract_code || '',
        constructorParams: dataInfo.constructor_params || '',
        optimizer: dataInfo.optimizer,
        compiler: dataInfo.compiler
      }
      // console.log('infoObj: ', infoObj);
      this.setState({
        contractVerifyState: true,
        contractInfoList: infoObj,
        loading: false
      }, async() => {
          this.getContractTokenList()
          await this.getContractInfos()
          this.viewFuntions()
          this.payableFuntions()
          this.nonePayableFuntions()
      })
    }
  }
  async getContractInfos() {
    const { contractVerifyState, contractInfoList } = this.state
    let smartcontract = await this.tronWeb.trx.getContract(
      this.props.filter.address
    );
    let obj = {
      abi: smartcontract.abi
    }
    if ( contractVerifyState ) {
      this.setState({
        contractInfoList: { abi: smartcontract.abi, ...contractInfoList }
      }, () => {
          // console.log('contractInfoList: ', this.state.contractInfoList);
      })
    } else {
      this.setState({
        contractInfoList: smartcontract
      })
    }
  }
  onChange = e => {
    this.setState({
      choiceContractItem: e.target.value,
    });
  }
  viewFuntions() {
    let { contractInfoList } = this.state;
    let list
    if (contractInfoList.abi.entrys) {
      list = contractInfoList.abi.entrys.filter(
        entry =>
          entry.type == "Function" &&
          (entry.stateMutability == "View" || entry.stateMutability == "Pure")
      );
      this.setState({
        viewContractList: list
      },() => {
          console.log('viewContractList: ', this.state.viewContractList);
      })
    }
  }
  payableFuntions() {
    let { contractInfoList } = this.state;
    let list
    if (contractInfoList.abi) {
      list = contractInfoList.abi.entrys.filter(
        entry => entry.type == "Function" && entry.stateMutability == "Payable"
      );
      this.setState({
        payableContractList: list
      }, () => {
          console.log('payableContractList: ', this.state.payableContractList);
      })
    }
  }
  nonePayableFuntions() {
    let { contractInfoList } = this.state;
    let list
    if (contractInfoList.abi) {
      list = contractInfoList.abi.entrys.filter(
        entry =>
          entry.type == "Function" && entry.stateMutability == "Nonpayable"
      );
      this.setState({
        nonePayableContractList: list
      }, () => {
          console.log('nonePayableContractList: ', this.state.nonePayableContractList);
      })
    }
  }
  events() {
    let { contractInfoList } = this.state;

    return contractInfoList.abi.entrys.filter(entry => entry.type == "Event");
  }

  async getContractTokenList () {
    let { filter, account } = this.props;
    const { tronWeb } = this.props.account;
    if (tronWeb) {
      let myAccount = await tronWeb.trx.getAccount(
        tronWeb.defaultAddress.hex
      );
      let listTokens = await tronWeb.trx.listTokens();
      const balance = await tronWeb.trx.getBalance(
        tronWeb.defaultAddress.hex
      );
      let currentTokens = [];
      if (myAccount.assetV2 != undefined) {
        myAccount.assetV2.forEach(item => {
          let token = {};
          token.id = item.key;
          token.name = listTokens.find(i => i.id == token.id).abbr;
          token.balance = item.value;
          currentTokens.push(token);
        });
      }
      currentTokens.push({
        id : '0',
        name: "TRX",
        balance: balance / 100000
      })
      this.setState({
        currentTokens: currentTokens
      })
      console.log('currentTokens: ', currentTokens);
    }
  }


  render() {
    let { choiceContractItem,
      contractInfoList,
      viewContractList,
      payableContractList,
      nonePayableContractList,
      currentTokens,
      contractVerifyState,
      loading } = this.state;
    let { filter } = this.props;
    let tabContent;

    if (choiceContractItem === 'code' && contractInfoList) {
      tabContent = (
        <ContractInfo filter={{ address: filter.address, contractInfoList: contractInfoList }}/>
      );
    } else if (choiceContractItem === 'read' && viewContractList) {
      tabContent = (
          viewContractList.map((val, key) => {
            return (
              <div key={key}>
                <EntryContract contractItem={val} index={key} address={filter.address} abi={contractInfoList.abi}/>
              </div>
            )
          })
      );
    } else if (choiceContractItem === 'write') {
      tabContent = (
        <div>
          {
            payableContractList.length != 0 ?
            <div>
                <div className="write-title">{tu('write_payable')}</div>
                {
                  payableContractList.map((val, key) => {
                    return (
                      <div key={key}>
                        <EntryContract contractItem={val} index={key} address={filter.address} currentTokens={currentTokens} />
                      </div>
                    )
                  })
                }
            </div>
            : null
          }
          {
            nonePayableContractList.length != 0 ?
              <div>
                <div className="write-title">{tu('write_nonePayable')}</div>
                {
                  nonePayableContractList.map((val, key) => {
                    return (
                      <div key={key}>
                        <EntryContract contractItem={val} index={key} address={filter.address} abi={contractInfoList.abi} />
                      </div>
                    )
                  })
                }
              </div>
              : null
          }
        </div>
      );
    }

    return (
        <main className="contract-container">
        {loading ? 
          <div className="loading-style" style={{ marginTop: '-20px' }}><TronLoader /></div>
         : 
          <div>
            {contractVerifyState ?
              <div className="tab-choice">
                <Radio.Group className="choice-btn" size="Small" onChange={this.onChange} value={this.state.choiceContractItem}>
                  <Radio.Button value="code">{tu('contract_code_choice')}</Radio.Button>
                  <Radio.Button value="read">{tu('contract_read')}</Radio.Button>
                  <Radio.Button value="write">{tu('contract_write')}</Radio.Button>
                </Radio.Group>
                <p>{tu('contract_name')}: <span>{contractInfoList.name ? contractInfoList.name : ''}</span></p>
                <p>{tu('contract_version')}: <span>{contractInfoList.compiler ? contractInfoList.compiler : ''}</span></p>
                <p>{tu('contract_optimize')}: <span>{contractInfoList.optimizer === 1 ? <span>{tu('contract_optimizered')}</span> : <span>{tu('contract_optimizer')}</span>}</span></p>
              </div>
             :
              <div className="contrat-verify">
                {tu('contract_verify_status')}<a href="/#/contracts/contract-Compiler/verify">{tu('contract_verify_btn')}</a>
              </div> 
            }
          </div>
         }
          <div className="tab-container">
            {tabContent}
          </div>

        </main>

    )
  }
}
