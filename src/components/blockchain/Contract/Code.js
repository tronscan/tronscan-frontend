import React from "react";
import { tu } from "../../../utils/i18n";
import xhr from "axios/index";
import { TronLoader } from "../../common/loaders";
import { Radio } from "antd";
import ContractInfo from "./ContractInfo";
import EntryContract from "./EntryContract";
import tronWeb from "tronweb";
import { connect } from "react-redux";
import { API_URL, IS_MAINNET, SUNWEBCONFIG } from "../../../constants";

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
      contractVerifyState: true,
      licensesList: [
        {
          label: "No License(None)",
          value: 1
        },
        {
          label: "The Unlicense(Unlicense)",
          value: 2
        },
        {
          label: "MIT License(MIT)",
          value: 3
        },
        {
          label: "GNU General Public License v2.0(GNU GPLv2)",
          value: 4
        },
        {
          label: "GNU General Public License v3.0(GNU GPLv3)",
          value: 5
        },
        {
          label: "GNU Lesser General Public License v2.1(GNU LGPLv2.1)",
          value: 6
        },
        {
          label: "GNU Lesser General Public License v3.0(GNU LGPLv3)",
          value: 7
        },
        {
          label: "BSD 2-clause “Simplified” license(BSD-2-Clause)",
          value: 8
        },
        {
          label: "BSD 3-clause “New” Or “Revised” license(BSD-3-Clause)",
          value: 9
        },
        {
          label: "Mozilla Public License 2.0(MPL-2.0)",
          value: 10
        },
        {
          label: "Open Software License 3.0(OSL-3.0)",
          value: 11
        },
        {
          label: "Apache 2.0(Apache-2.0)",
          value: 12
        }
      ]
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

    let { data } = await xhr
      // .post(`${API_URL}/api/solidity/contract/info`, params)
      // .post(`http://52.15.126.154:9017/api/solidity/contract/info`, params)

      .post(`https://apilist.tronscan.org/api/solidity/contract/info`, {
        contractAddress: "TRzwSBRFzfUuKwTAh7Yh4ih6UGTfaDDrGY"
      })
      .catch(function(e) {
        console.log(e);
      });

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

    if (status === 3 || status === 1 || status === 4) {
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
      let licenses = this.state.licensesList;

      let licenseObj = licenses.find(item => {
        return item.value == license;
      });
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
        license: licenseObj && licenseObj.label
      };
      this.props.handleContract(infoObj);
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

  async getContractInfos() {
    const {
      filter: { address }
    } = this.props;
    const { contractVerifyState, contractInfoList } = this.state;
    let smartcontract = await this.tronWeb.trx.getContract(address);
    if (contractVerifyState) {
      this.setState({
        contractInfoList: { abi: smartcontract.abi, ...contractInfoList }
      });
    } else {
      this.setState({
        contractInfoList: smartcontract
      });
    }
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
    const { filter } = this.props;
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
        {IS_MAINNET ? (
          <div className="tab-choice">
            {radioBtnItem}
            <div className="d-flex">
              <p className="flex-1 border-1">
                {tu("contract_name")}: <span>{name || ""}</span>
              </p>
              <p className="flex-1 border-1">
                {tu("contract_version")}: <span>{compiler || ""}</span>
              </p>
            </div>
            <div className="d-flex">
              <p className="flex-1 border-1">
                {tu("contract_optimize")}:{" "}
                <span>
                  {optimizer === 1 ? (
                    <span>{tu("contract_optimizered")}</span>
                  ) : (
                    <span>{tu("contract_optimizer")}</span>
                  )}
                  {optimizer === 1 && ` with ${optimizer_runs} runs`}
                </span>
              </p>
              <p className="flex-1 border-1">License:{license}</p>
            </div>
          </div>
        ) : (
          ""
        )}
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
            {contractVerifyState ? contractMessItem : contractVerifyBtnItem}
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

export default connect(mapStateToProps, null)(Code);
