import React from "react";
import xhr from "axios";
import {API_URL,uuidv4} from "../../../constants";
import { injectIntl } from "react-intl";
import { TronLoader } from "../../common/loaders";
import { EnergyConsumeChart } from "../../common/LineCharts";

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
    let {data: {data}} = await xhr.get(API_URL + "/api/onecontractenergystatistic?&address="+ address+"&uuid="+uuidv4);
    data.pop()
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
            {
              energyConsumeData === null ? <TronLoader/> :
              <EnergyConsumeChart 
                source='singleChart'
                style={{height: 500}}
                data={energyConsumeData}
                type="c1"
                intl={intl}
              />
            }
        </main>

    )
  }
}

export default injectIntl(Energy)