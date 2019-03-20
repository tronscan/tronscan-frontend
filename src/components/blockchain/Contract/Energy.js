import React from "react";
import ReactAce from 'react-ace-editor';
import {CopyText} from "../../common/Copy";
import {tu, tv} from "../../../utils/i18n";
import {Client} from "../../../services/api";
import xhr from "axios";
// import {API_URL} from "../../../constants";
import { AddressLink} from "../../common/Links";
import { injectIntl } from "react-intl";
import { TronLoader } from "../../common/loaders";
import { EnergyConsumeChart } from "../../common/LineCharts";

const API_URL = 'http://52.15.68.74:10000'
class Energy extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      energyConsumeData: null,
      loading: true
    };
  }

  componentDidMount() {
    this.loadEnergyConsumeData();
  }

  async loadEnergyConsumeData() {
    let {filter: {address}} = this.props
    let {data: {data}} = await xhr.get(API_URL + "/api/onecontractenergystatistic?address="+ address);

    this.setState({
        energyConsumeData: data,
        loading: false
    });
}

  render() {
    let {energyConsumeData, loading} = this.state;
    let {intl} = this.props

    return (
        <main className="container pt-5">
            {loading && <div className="loading-style" style={{marginTop: '-20px'}}><TronLoader/></div>}
            {
              energyConsumeData === null ? <TronLoader/> :
              <EnergyConsumeChart 
                source='singleChart'
                style={{height: 500}}
                data={energyConsumeData}
                intl={intl}
              />
            }
        </main>

    )
  }
}

export default injectIntl(Energy)