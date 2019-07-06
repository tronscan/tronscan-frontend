import React from "react";
import {CopyText} from "../../common/Copy";
import {tu, tv} from "../../../utils/i18n";
import {Client} from "../../../services/api";
import xhr from "axios";
import {API_URL} from "../../../constants";
import { AddressLink} from "../../common/Links";
import {FormattedNumber, injectIntl} from "react-intl";
import { TronLoader } from "../../common/loaders";
import { ContractInvocationChart } from "../../common/LineCharts";
import { upperFirst } from 'lodash'
import SmartTable from "../../common/SmartTable.js"
import { DatePicker } from 'antd';
import moment from 'moment';
import tronWeb from 'tronweb';

class ContractShow extends React.Component {

  constructor(props) {
    super(props);
    this.tronWeb = new tronWeb({
      fullNode: 'https://api.trongrid.io',
      solidityNode: 'https://api.trongrid.io',
      eventServer: 'https://api.trongrid.io',
    })
    this.state = {
      ContractInvocation: null,
      ContractInvocationChartData: null,
      loading: true,
      date: new Date().getTime() - 2 * 24*60*60*1000,
      total: 0
    };
  }

  componentDidMount() {
    
    console.log('this.props', this.props);
    this.getContractInfos()
  }

  async getContractInfos () {
    console.log(this.tronWeb);
    let smartcontract = await this.tronWeb.trx.getContract(
      this.props.filter.address
    );
    console.log('smartcontract: ', smartcontract);
  }

  render() {
    let {ContractInvocation, ContractInvocationChartData, loading, total, date} = this.state;
    let { intl, filter} = this.props

    return (
        <main className="mt-5 p-0">
        <div>{filter.address}</div>
        </main>

    )
  }
}

export default injectIntl(ContractShow)