import React from "react";
import {tu} from "../../../utils/i18n";
import xhr from "axios";
import {API_URL,ONE_TRX,uuidv4} from "../../../constants";
import { AddressLink} from "../../common/Links";
import {FormattedNumber, injectIntl} from "react-intl";
import { TronLoader } from "../../common/loaders";
import { LineReactHighChartTRXVolumeContract } from "../../common/LineCharts";
import { upperFirst } from 'lodash'
import SmartTable from "../../common/SmartTable.js"
import { DatePicker } from 'antd';
import moment from 'moment';
import {cloneDeep} from "lodash";
import BigNumber from "bignumber.js";


class TRXBalancesChart extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      TRXVolume: null,
      loading: true,
      date: new Date().getTime() - 2 * 24*60*60*1000,
      total: 0
    };
  }

  componentDidMount() {
    this.loadVolume();
  }


  async loadVolume(){
    let {filter: {address},intl} = this.props

    let volumeData = await xhr.get(
        `${API_URL}/api/contract_account_history?uuid=${uuidv4}&address=${address}`
    );
    let volumeUSD = volumeData.data.data;
    let volume = volumeUSD.map(function (v, i) {
        return {
            time: moment(v['time']).valueOf(),
            volume_billion: v['balance'] / ONE_TRX,
        }
    })
    this.setState({
        TRXVolume: volume,
        loading:false
    });
    // let higest = {date: '', increment: ''};
    // let lowest = {date: '', increment: ''};
    // let vo = cloneDeep(volume).sort(this.compare('volume_usd_num'));
    // for (let v in vo) {
    //     vo[v] = {date: vo[v].time, ...vo[v]};
    // }
    // this.setState({
    //     summit: {
    //         volumeStats_sort: [
    //             {
    //                 date: vo[vo.length - 1].time,
    //                 increment: vo[vo.length - 1].volume_usd_num
    //             },
    //             {
    //                 date: vo[0].time,
    //                 increment: vo[0].volume_usd_num
    //             }],
    //     }
    // });
}
  

  
  

  render() {
    let {TRXVolume, loading, total} = this.state;
    let {intl} = this.props
    

    return (
        <main className="mt-5 p-0">
            {
                loading? <div className="loading-style" style={{marginTop: '-20px'}}><TronLoader/></div>:
                <div className="pb-4">
                    {
                        TRXVolume === null ? <TronLoader/> :
                        <LineReactHighChartTRXVolumeContract
                            source='singleChart'
                            style={{height: 500}}
                            data={TRXVolume}
                            intl={intl}
                        />
                    }
                </div>
            }
        </main>
          
    )
  }
}

export default injectIntl(TRXBalancesChart)