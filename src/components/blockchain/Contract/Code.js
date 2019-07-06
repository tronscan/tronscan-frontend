import React from "react";
import {CopyText} from "../../common/Copy";
import {tu, tv} from "../../../utils/i18n";
import {Client} from "../../../services/api";
import xhr from "axios";
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
    this.tronWeb = new tronWeb({
      fullNode: 'https://api.trongrid.io',
      solidityNode: 'https://api.trongrid.io',
      eventServer: 'https://api.trongrid.io',
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
    this.getContractTokenList()
    await this.getContractInfos()
    this.viewFuntions()
    this.payableFuntions()
    this.nonePayableFuntions()
    
  }
  async getContractInfos() {
    let smartcontract = await this.tronWeb.trx.getContract(
      this.props.filter.address
    );
    this.setState({
      contractInfoList: smartcontract
    })
  }
  onChange = e => {
    this.setState({
      choiceContractItem: e.target.value,
    });
  }
  viewFuntions() {
    let { contractInfoList } = this.state;
    let list = contractInfoList.abi.entrys.filter(
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
  payableFuntions() {
    let { contractInfoList } = this.state;
    let list = contractInfoList.abi.entrys.filter(
      entry => entry.type == "Function" && entry.stateMutability == "Payable"
    );
    this.setState({
      payableContractList: list
    }, () => {
        console.log('payableContractList: ', this.state.payableContractList);
    })
  }
  nonePayableFuntions() {
    let { contractInfoList } = this.state;
    let list = contractInfoList.abi.entrys.filter(
      entry =>
        entry.type == "Function" && entry.stateMutability == "Nonpayable"
    );
    this.setState({
      nonePayableContractList: list
    }, () => {
        console.log('nonePayableContractList: ', this.state.nonePayableContractList);
    })
  }
  events() {
    let { contractInfoList } = this.state;
    return contractInfoList.abi.entrys.filter(entry => entry.type == "Event");
  }

  async getContractTokenList () {
    let { filter, account } = this.props;
    const { tronWeb } = this.props.account;
    console.log('tronWeb: ', tronWeb);
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
      contractVerifyState } = this.state;
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
            payableContractList ?
            <div>
                <div>Run these functions with Trx or Token</div>
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
            nonePayableContractList ?
              <div>
                <div>Run these functions will consume Trx or Energy</div>
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
          {contractVerifyState ?
            <div className="tab-choice">
              <Radio.Group className="choice-btn" size="Small" onChange={this.onChange} value={this.state.choiceContractItem}>
                <Radio.Button value="code">{tu('contract_code_choice')}</Radio.Button>
                <Radio.Button value="read">{tu('contract_read')}</Radio.Button>
                <Radio.Button value="write">{tu('contract_write')}</Radio.Button>
              </Radio.Group>
              <p>{tu('contract_name')}: <span>合约名称</span></p>
              <p>{tu('contract_version')}: <span>合约名称</span></p>
              <p>{tu('contract_optimize')}: <span>合约名称</span></p>
            </div>
            : 
            <div className="contrat-verify">
              该合约未验证，点击此处<a>去验证</a>
            </div>
          }
          
          <div className="tab-container">
            {tabContent}
          </div>

        </main>

    )
  }
}
