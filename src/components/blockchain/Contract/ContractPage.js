import React from "react";
import { injectIntl } from "react-intl";
import tronWeb from "tronweb";
import {
  API_URL,
  IS_MAINNET,
  SUNWEBCONFIG,
  CONTRACT_LICENSES,
  CONTRACT_NODE_API
} from "../../../constants";

class ContractShow extends React.Component {
  constructor(props) {
    super(props);
    this.tronWeb = new tronWeb({
      fullNode: SUNWEBCONFIG.MAINFULLNODE,
      solidityNode: SUNWEBCONFIG.MAINSOLIDITYNODE,
      eventServer: SUNWEBCONFIG.MAINEVENTSERVER
    });
    this.state = {
      ContractInvocation: null,
      ContractInvocationChartData: null,
      loading: true,
      date: new Date().getTime() - 2 * 24 * 60 * 60 * 1000,
      total: 0
    };
  }

  componentDidMount() {
    this.getContractInfos();
  }

  async getContractInfos() {
    let smartcontract = await this.tronWeb.trx.getContract(
      this.props.filter.address
    );
  }

  render() {
    let {
      ContractInvocation,
      ContractInvocationChartData,
      loading,
      total,
      date
    } = this.state;
    let { intl, filter } = this.props;

    return (
      <main className="mt-5 p-0">
        <div>{filter.address}</div>
      </main>
    );
  }
}

export default injectIntl(ContractShow);
