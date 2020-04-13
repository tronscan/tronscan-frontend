import React from "react";
import { tu } from "../../../utils/i18n";
import xhr from "axios/index";
import { TronLoader } from "../../common/loaders";
import { Radio, Tooltip } from "antd";
import ContractInfo from "./ContractInfo";
import EntryContract from "./EntryContract";
import tronWeb from "tronweb";
import { connect } from "react-redux";
import {
  API_URL,
  IS_MAINNET,
  SUNWEBCONFIG,
  CONTRACT_LICENSES,
  CONTRACT_NODE_API,
  WARNING_VERSIONS
} from "../../../constants";
import { injectIntl } from "react-intl";

class Code extends React.Component {
  constructor(props) {
    super(props);
    if (IS_MAINNET) {
      this.tronWeb = new tronWeb({
        fullNode: SUNWEBCONFIG.MAINFULLNODE,
        solidityNode: SUNWEBCONFIG.MAINSOLIDITYNODE,
        eventServer: SUNWEBCONFIG.MAINEVENTSERVER
      });
    } else {
      this.tronWeb = new tronWeb({
        fullNode: SUNWEBCONFIG.SUNFULLNODE,
        solidityNode: SUNWEBCONFIG.SUNSOLIDITYNODE,
        eventServer: SUNWEBCONFIG.SUNEVENTSERVER
      });
    }
    this.state = {
      loading: true,
      choiceContractItem: "code",
      contractInfoList: "",
      viewContractList: [],
      payableContractList: [],
      nonePayableContractList: [],
      eventContractList: [],
      currentTokens: [],
      contractVerifyState: true
    };
  }

  async componentDidMount() {
    await this.getContractVerifyStatus();
  }

  async getContractVerifyStatus() {
    const {
      filter: { address }
    } = this.props;
    const params = {
      contractAddress: address
    };

    try{
      let { data } = await xhr
      // .post(`${API_URL}/api/solidity/contract/info`, params)
      .post(`${CONTRACT_NODE_API}/api/solidity/contract/info`, params)
      .catch(function(e) {
        console.log(e);
      });
      if(data){
        const dataInfo = data.data;
        // eslint-disable-next-line
        const {
          status,
          contract_name,
          byte_code,
          contract_code,
          constructor_params,
          optimizer,
          compiler,
          optimizer_runs,
          license
        } = dataInfo;
    
        if (!status || status === 3 || status === 1 || status === 4) {
          this.setState(
            {
              contractVerifyState: false,
              loading: false
            },
            async () => {
              await this.getContractInfos();
            }
          );
        } else {
          let infoObj;
          const abi = dataInfo.abi && JSON.parse(dataInfo.abi);
          /* eslint-disable */
          infoObj = {
            interfaceAbi: abi || "",
            name: contract_name || "",
            bytecode: byte_code || "",
            contractCode: contract_code || [],
            constructorParams: constructor_params || "",
            optimizer,
            compiler,
            optimizer_runs,
            license: CONTRACT_LICENSES[license] || "--"
          };
          /* eslint-disable */
          this.setState(
            {
              contractVerifyState: true,
              contractInfoList: infoObj,
              loading: false
            },
            async () => {
              this.getContractTokenList();
              await this.getContractInfos();
              this.viewFuntions();
              this.payableFuntions();
              this.nonePayableFuntions();
            }
          );
        }
      }
    }catch(e){
      console.log(e)
    }
  }

  async getContractInfos() {
    const {
      filter: { address }
    } = this.props;
    const { contractVerifyState, contractInfoList } = this.state;
    let smartcontract = await this.tronWeb.trx.getContract(address);
    let contractInfoListNew;
     if (contractVerifyState) {
      contractInfoListNew = { abi: smartcontract.abi, ...contractInfoList };
     }else{
      contractInfoListNew = smartcontract;
     }
      this.setState({
        contractInfoList: contractInfoListNew
      },()=>{
       if(contractInfoListNew.abi){
          this.getContractTokenList();
          this.viewFuntions();
          this.payableFuntions();
          this.nonePayableFuntions();
       }
      });
    // } else {
    //   this.setState({
    //     contractInfoList: smartcontract
    //   });
    // }
  }

  /**
   * 代码、阅读合约、编写合约切换
   * @param e: 当前元素
   */
  onChange = e => {
    this.setState({
      choiceContractItem: e.target.value
    });
  };

  viewFuntions() {
    const {
      contractInfoList: {
        abi: { entrys }
      }
    } = this.state;
    if (entrys) {
      const list = entrys.filter(
        entry =>
          entry.type === "Function" &&
          (entry.stateMutability === "View" || entry.stateMutability === "Pure")
      );
      this.setState({
        viewContractList: list
      });
    }
  }

  payableFuntions() {
    const {
      contractInfoList: { abi }
    } = this.state;
    console.log(abi);
    if (JSON.stringify(abi) != "{}") {
      const { entrys } = abi;
      const list = entrys.filter(
        entry =>
          entry.type === "Function" && entry.stateMutability === "Payable"
      );
      this.setState({
        payableContractList: list
      });
    }
  }

  nonePayableFuntions() {
    const {
      contractInfoList: { abi }
    } = this.state;
    if (JSON.stringify(abi) != "{}") {
      const { entrys } = abi;
      const list = entrys.filter(
        entry =>
          entry.type === "Function" && entry.stateMutability === "Nonpayable"
      );
      this.setState({
        nonePayableContractList: list
      });
    }
  }

  events() {
    const {
      contractInfoList: {
        abi: { entrys }
      }
    } = this.state;

    return entrys.filter(entry => entry.type === "Event");
  }

  async getContractTokenList() {
    const { tronWeb } = this.props.account;
    if (tronWeb) {
      const myAccount = await tronWeb.trx.getAccount(
        tronWeb.defaultAddress.hex
      );
      const listTokens = await tronWeb.trx.listTokens();
      const balance = await tronWeb.trx.getBalance(tronWeb.defaultAddress.hex);
      let currentTokens = [];
      if (myAccount.assetV2 !== undefined) {
        myAccount.assetV2.forEach(item => {
          let token = {};
          token.id = item.key;
          token.name = listTokens.find(i => i.id === token.id).abbr;
          token.balance = item.value;
          currentTokens.push(token);
        });
      }
      currentTokens.push({
        id: "0",
        name: "TRX",
        balance: balance / 100000
      });
      this.setState({
        currentTokens: currentTokens
      });
    }
  }
  solidityVersions = v => {
    let version;
    switch (v) {
      case "tron-0.4.24":
      case "tronbox_soljson_v1":
      case "tronbox_soljson_v2":
        version = "0.4.24";
        break;
      case "tron-0.4.25_Odyssey_v3.2.3":
      case "solidity-0.4.25_Odyssey_v3.2.3":
      case "tronbox_soljson_v3":
        version = "0.4.25";
        break;
      case "tron-0.5.4_Odyssey_v3.6.0":
        version = "0.5.4";
        break;
      case "tron-0.5.8_Odyssey_v3.6.0":
        version = "0.5.8";
        
        break;
      case "tron-0.5.9_Odyssey_v3.6.5":
        version = "0.5.9";
        break;
      case "tron-0.5.10_Odyssey_v3.6.6":
        version = "0.5.10"; 
        break;
      default:
        version = v.match(/\d+(.\d+)*/g)[0] || "";
        break;
    }
    return version;
  };


  render() {
    const {
      choiceContractItem,
      contractInfoList,
      viewContractList,
      payableContractList,
      nonePayableContractList,
      currentTokens,
      contractVerifyState,
      loading
    } = this.state;
    const { filter, intl } = this.props;
    const {
      abi,
      name,
      compiler,
      optimizer,
      optimizer_runs,
      license
    } = contractInfoList;
    let tabContent;

    if (choiceContractItem === "code" && contractInfoList) {
      tabContent = (
        <ContractInfo
          filter={{
            address: filter.address,
            contractInfoList: contractInfoList
          }}
        />
      );
    } else if (choiceContractItem === "read" && viewContractList) {
      tabContent = viewContractList.map((val, key) => {
        return (
          <div key={key}>
            <EntryContract
              contractItem={val}
              index={key}
              address={filter.address}
              abi={abi}
            />
          </div>
        );
      });
    } else if (choiceContractItem === "write") {
      tabContent = (
        <div>
          {payableContractList.length !== 0 ? (
            <div>
              <div className="write-title">{tu("write_payable")}</div>
              {payableContractList.map((val, key) => {
                return (
                  <div key={key}>
                    <EntryContract
                      contractItem={val}
                      index={key}
                      address={filter.address}
                      currentTokens={currentTokens}
                    />
                  </div>
                );
              })}
            </div>
          ) : null}
          {nonePayableContractList.length != 0 ? (
            <div>
              <div className="write-title">{tu("write_nonePayable")}</div>
              {nonePayableContractList.map((val, key) => {
                return (
                  <div key={key}>
                    <EntryContract
                      contractItem={val}
                      index={key}
                      address={filter.address}
                      abi={contractInfoList.abi}
                    />
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      );
    }

    // 按钮Item
    const radioBtnItem = (
      <Radio.Group
        className="choice-btn"
        size="Small"
        onChange={this.onChange}
        value={this.state.choiceContractItem}
      >
        <Radio.Button value="code">{tu("contract_code_choice")}</Radio.Button>
        <Radio.Button value="read">{tu("contract_read")}</Radio.Button>
        <Radio.Button value="write">{tu("contract_write")}</Radio.Button>
      </Radio.Group>
    );

    // 已验证合约信息Item
    const contractMessItem = (
      // <div>
      //     {
      //         IS_MAINNET? <div className="tab-choice">
      //             {radioBtnItem}
      //             <p>{tu('contract_name')}: <span>{name || ''}</span></p>
      //             <p>{tu('contract_version')}: <span>{compiler || ''}</span></p>
      //             <p>{tu('contract_optimize')}: <span>
      //         {optimizer === 1
      //             ? <span>{tu('contract_optimizered')}</span>
      //             : <span>{tu('contract_optimizer')}</span>}
      //     </span></p>
      //         </div>:''
      //     }
      // </div>
      <div>
        {/* {IS_MAINNET ? ( */}
          <div className="tab-choice">
            {radioBtnItem}
            <p className="contract-source-code-title">
              {contractVerifyState===true ? <div><img style={{ width: "20px", height: "20px" }} src={require("../../../images/contract/Verified.png")}/> {tu("contract_source_code_match")}</div>
               : <div><img style={{ width: "20px", height: "20px" }} src={require("../../../images/contract/Unverified.png")}/>{tu("contract_source_code_no_match")}</div>
              }
              
            </p>
            <div className="d-flex contract-header_list contract-detail">
              <div className="contract-header__item contract-header">
                <ul>
                  <li>
                    <p className="contract-left">{tu("contract_name")}:</p>
                    {name || ""}
                  </li>
                  <li>
                    <p>{tu("contract_optimize")}:</p>
                    <span>
                      {optimizer === 1 ? (
                        <span>{tu("contract_optimizered")}</span>
                      ) : (
                        <span>{tu("contract_optimizer")}</span>
                      )}
                      {"  "}
                      {optimizer === 1 && ` with ${optimizer_runs} runs`}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="contract-header__item contract-header">
                <ul>
                  <li>
                    <p>{tu("contract_version")}:</p>
                    {compiler
                      ? `solidity ${this.solidityVersions(compiler)}`
                      : "--"}
                    {WARNING_VERSIONS.indexOf(compiler) > -1 ? (
                      <Tooltip
                        placement="top"
                        title={intl.formatMessage({
                          id: "contract_version_tip"
                        })}
                      >
                        <img
                          src={require("../../../images/contract/warning.png")}
                          style={{ height: "14px", marginRight: "4px", marginTop: '2px' }}
                        />
                      </Tooltip>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    <p>License:</p>
                    {license}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        {/* ) : (
          ""
        )} */}
      </div>
    );
    // 去验证合约Item
    const contractVerifyBtnItem = (
      <div className="contrat-verify">
        {IS_MAINNET ? (
          <div>
            {tu("contract_verify_status")}
            <a href="/#/contracts/contract-Compiler/verify">
              {tu("contract_verify_btn")}
            </a>
          </div>
        ) : (
          ""
        )}
      </div>
    );

    return (
      <main className="contract-container">
        {loading ? (
          <div className="loading-style" style={{ marginTop: "-20px" }}>
            <TronLoader />
          </div>
        ) : (
          <div>
            {/* {contractVerifyState ? contractMessItem : contractVerifyBtnItem} */}
            { contractMessItem }
          </div>
        )}
        <div className="tab-container">{tabContent}</div>
      </main>
    );
  }
}

function mapStateToProps(state) {
  return {
    account: state.app.account
  };
}

export default connect(mapStateToProps, null)(injectIntl(Code));
