import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {loadWitnesses} from "../../actions/network";
import {tu} from "../../utils/i18n";
import {TronLoader} from "../common/loaders";
import {FormattedNumber} from "react-intl";
import {injectIntl} from "react-intl";
import _, {filter, maxBy, sortBy} from "lodash";
import {AddressLink, BlockNumberLink} from "../common/Links";
import {SR_MAX_COUNT} from "../../constants";
import {WidgetIcon} from "../common/Icon";
import {RepresentativesRingPieReact} from "../common/RingPieChart";
import xhr from "axios/index";
class Representatives extends Component {
  constructor() {
    super();
    this.state = {
        pieChart: [],
        pieData:[{"address":"TYVJ8JuQ6ctzCa2u79MFmvvNQ1U2tYQEUM","name":"","url":"http://tronone.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TGzz8gjYiYRqpfmDwnLxfgPuLVNmpCswVp","name":"Sesameseed","url":"https://www.sesameseed.org","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TEKUPpjTMKWw9LJZ9YJ4enhCjAmVXSL7M6","name":"lianjinshu","url":"http://www.lianjinshu.com","blockProduced":252,"total":6784,"percentage":0.03714622641509434},{"address":"TDGmmTC7xDgQGwH4FYRGuE7SFH2MePHYeH","name":"TeamTronics","url":"https://www.teamtronics.org","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TPRxUBEakukBMwTScCHgvCPSBYk5UhfboJ","name":"","url":"http://www.cryptodiva.io/","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TTcYhypP8m4phDhN6oRexz2174zAerjEWP","name":"CryptoGuyInZA","url":"https://www.cryptoguyinza.co.za/","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TGj1Ej1qRzL9feLTLhjwgxXF4Ct6GTWg2U","name":"Skypeople","url":"http://www.skypeople.co.kr","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TVMP5r12ymtNerq5KB4E8zAgLDmg2FqsEG","name":"CryptoGirls","url":"https://www.cryptogirls.ro/","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TMAbjAuefZqzJAyGhkn4AbWa3jinzcZtGc","name":"MLG-Global","url":"https://mlgblockchain.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TFA1qpUkQ1yBDw4pgZKx25wEZAqkjGoZo1","name":"JustinSunTron","url":"https://twitter.com/justinsuntron","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TRXDEXMoaAprSGJSwKanEUBqfQjvQEDuaw","name":"TrxDexCom","url":"https://TrxDex.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TSNbzxac4WhxN91XvaUfPTKP2jNT18mP6T","name":"BitTorrent","url":"https://www.bittorrent.com/","blockProduced":252,"total":6784,"percentage":0.03714622641509434},{"address":"TY65QiDt4hLTMpf3WRzcX357BnmdxT2sw9","name":"uTorrent","url":"https://www.utorrent.com/","blockProduced":252,"total":6784,"percentage":0.03714622641509434},{"address":"TKSXDA8HfE9E1y39RczVQ1ZascUEtaSToF","name":"CryptoChain","url":"http://cryptochain.network","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TV6qcwSp38uESiDczxxb7zbJX1h2LfDs78","name":"","url":"https://tronstronics.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TLTDZBcPoJ8tZ6TTEeEqEvwYFk2wgotSfD","name":"","url":"http://TronGr27.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"THKJYuUmMKKARNf7s2VT51g5uPY6KEqnat","name":"","url":"http://TronGr1.com","blockProduced":252,"total":6784,"percentage":0.03714622641509434},{"address":"TZHvwiw9cehbMxrtTbmAexm9oPo4eFFvLS","name":"","url":"http://TronGr15.com","blockProduced":252,"total":6784,"percentage":0.03714622641509434},{"address":"TWm3id3mrQ42guf7c4oVpYExyTYnEGy3JL","name":"","url":"http://TronGr9.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TVDmPWGYxgi5DNeW8hXrzrhY8Y6zgxPNg4","name":"","url":"http://TronGr2.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TK6V5Pw2UWQWpySnZyCDZaAvu1y48oRgXN","name":"","url":"http://TronGr6.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TX3ZceVew6yLC5hWTXnjrUFtiFfUDGKGty","name":"","url":"http://TronGr18.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TGK6iAKgBmHeQyp5hn3imB71EDnFPkXiPR","name":"","url":"http://TronGr16.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TNGoca1VHC6Y5Jd2B1VFpFEhizVk92Rz85","name":"","url":"http://TronGr12.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TDarXEG2rAD57oa7JTK785Yb2Et32UzY32","name":"","url":"http://TronGr4.com","blockProduced":252,"total":6784,"percentage":0.03714622641509434},{"address":"TDbNE1VajxjpgM5p7FyGNDASt3UVoFbiD3","name":"","url":"http://TronGr26.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TCf5cqLffPccEY7hcsabiFnMfdipfyryvr","name":"","url":"http://TronGr20.com","blockProduced":252,"total":6784,"percentage":0.03714622641509434}]
    };
  }
  componentDidMount() {
    this.props.loadWitnesses();
    this.getPiechart();
  }

  getWitnesses() {
    let {witnesses} = this.props;

    witnesses = witnesses.map(w => ({
      ...w,
      inSync: this.isinSync(w),
      productivity: (w.producedTotal / (w.producedTotal + w.missedTotal)) * 100,
    }));

    return sortBy(filter(witnesses, w => w.producer), w => w.votes * -1)
      .concat(sortBy(filter(witnesses, w => !w.producer), w => w.votes * -1))
      .map((w, index) => ({ ...w, index }));
  }

  isinSync (account) {
    let {witnesses} = this.props;
    let maxBlockNumber = maxBy(witnesses, witness => witness.latestBlockNumber).latestBlockNumber;
    return account.latestBlockNumber > maxBlockNumber - SR_MAX_COUNT;
  }

  getPiechart= async () =>{
      let {intl} = this.props;
      //let {data} = await xhr.get("http://172.16.20.198:9000/api/witness/maintenance-statistic");
      let data = this.state.pieData;
      let PiechartData = [];
      if (data.length > 0) {
          data.map((val,i) => {
              PiechartData.push({
                  key: i+1,
                  name: val.name?val.name:val.url,
                  volumeValue: intl.formatNumber(val.blockProduced),
                  volumePercentage: intl.formatNumber(val.percentage*100, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2
                  }) + '%',
              });

          })
      }
     // PiechartData.sortBy((a, b) => b.volumeValue - a.volumeValue);
      this.setState({
          pieChart: PiechartData
      });
  }

  renderWitnesses(witnesses) {

    if (witnesses.length === 0) {
      return (
        <div className="card">
          <TronLoader>
            {tu("loading_representatives")}
          </TronLoader>
        </div>
      );
    }

    let superRepresentatives = sortBy(filter(witnesses, w => w.producer), w => w.votes * -1);
    let candidateRepresentatives = sortBy(filter(witnesses, w => !w.producer), w => w.votes * -1);

    return (
      <div className="card border-0">
        <table className="table table-hover table-striped bg-white m-0">
          <thead className="thead-dark">
            <tr>
              <th className="text-right d-none d-lg-table-cell">#</th>
              <th>{tu("name")}</th>
              <th className="text-right text-nowrap">{tu("status")}</th>
              <th className="text-right text-nowrap d-none d-sm-table-cell">{tu("last_block")}</th>
              <th className="text-right text-nowrap d-none d-md-table-cell">{tu("blocks_produced")}</th>
              <th className="text-right text-nowrap d-none d-md-table-cell">{tu("blocks_missed")}</th>
              <th className="text-right text-nowrap d-none d-md-table-cell">{tu("transactions")}</th>
              <th className="text-right text-nowrap d-none d-sm-table-cell">{tu("productivity")}</th>
            </tr>
          </thead>
          <tbody>
          <tr>
            <td colSpan="9" className="bg-danger text-white text-center font-weight-bold">
              {tu("Super Representatives")}
            </td>
          </tr>
          {superRepresentatives.map(account => <Row key={account.address} account={account}/>)}
          <tr>
            <td colSpan="9" className="bg-secondary text-white text-center font-weight-bold">
              {tu("Super Representative Candidates")}
            </td>
          </tr>
          {candidateRepresentatives.map(account => <Row key={account.address} account={account} showSync={false}/>)}
          </tbody>
        </table>
      </div>
    )
  }

  render() {
    let {intl} = this.props;
    let {pieChart} = this.state;
    let witnesses = this.getWitnesses();
    let productivityWitnesses = witnesses.slice(0, SR_MAX_COUNT);

    let mostProductive = sortBy(productivityWitnesses, w => w.productivity * -1)[0];
    let leastProductive = _(productivityWitnesses)
      .filter(w => w.producedTotal > 0)
      .sortBy(w => w.productivity)
      .value()[0];

    return (
      <main className="container header-overlap pb-3">
        <div className="row">
            {
                witnesses.length > 0 && <div className="col-md-6">
                    <div className="mt-3 mt-md-3">
                        <div className="card h-100 widget-icon">
                            <WidgetIcon className="fa fa-user-tie text-secondary"  />
                            <div className="card-body text-center">
                                <h3 className="text-primary">
                                    <FormattedNumber value={witnesses.length} />
                                </h3>
                                {tu("representatives")}
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 mt-md-3">
                        <div className="card h-100">
                            <div className="card-body text-center widget-icon">
                                <WidgetIcon className="fa fa-arrow-up text-success" style={{bottom: 10}}  />
                                <h3 className="text-success">
                                    <FormattedNumber value={mostProductive.productivity}/>%
                                </h3>
                                {tu("highest_productivity")}<br/>
                                <AddressLink address={mostProductive.address}>
                                    {mostProductive.name || mostProductive.url}
                                </AddressLink>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 mt-md-3">
                        <div className="card h-100 widget-icon">
                            <WidgetIcon className="fa fa-arrow-down text-danger" style={{bottom: 10}}  />
                            <div className="card-body text-center">
                                <h3 className="text-danger">
                                    <FormattedNumber maximumFractionDigits={2}
                                                     minimunFractionDigits={2}
                                                     value={leastProductive.productivity}/>%
                                </h3>
                                {tu("lowest_productivity")}<br/>
                                <AddressLink address={leastProductive.address}>
                                    {leastProductive.name || leastProductive.url}
                                </AddressLink>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {
                pieChart.length > 0 && <div className="col-md-6 mt-3">
                    <div className="card">
                        <div className="card-body">
                            <div style={{height: 330}}>
                                {
                                    pieChart.length ===0 ?
                                        <TronLoader/> :
                                        <RepresentativesRingPieReact message={{id:'calculation_of_calculation_of_force'}} intl={intl} data={pieChart} style={{height: 300}}/>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }

        </div>

        <div className="row mt-3">
          <div className="col-md-12">
            {this.renderWitnesses(witnesses)}
          </div>
        </div>
      </main>
    )
  }
}

function Row({account, showSync = true}) {
  return (
    <tr key={account.address}>
      <td className="text-right d-none d-lg-table-cell">{account.index + 1}</td>
      <td>
        {
          account.name ?
            <Fragment>
              <AddressLink address={account.address}>
                {account.name}<br/>
                <span className="small text-muted">{account.url}</span>
              </AddressLink>
            </Fragment>  :
            <AddressLink address={account.address} >{account.url}</AddressLink>
        }
      </td>
      {
        showSync ?
          <td className="text-center">
            {
              account.inSync  ?
                <span key="no" className="text-success"><i className="fas fa-circle"/></span> :
                <span key="yes" className="text-danger"><i className="fa fa-times"/></span>
            }
          </td> : <td>&nbsp;</td>
      }
      <td className="text-right d-none d-sm-table-cell">
        <BlockNumberLink number={account.latestBlockNumber} />
      </td>
      <td className="text-right d-none d-md-table-cell">
        <FormattedNumber value={account.producedTotal} />
      </td>
      <td className="text-right d-none d-md-table-cell">
        <FormattedNumber value={account.missedTotal} />
      </td>
      <td className="text-right d-none d-md-table-cell text-nowrap">
        <FormattedNumber value={account.producedTrx} />
      </td>
      <td className="text-right d-none d-sm-table-cell">
        {
          account.producedTotal > 0 ? (
            <Fragment>
              <FormattedNumber
                maximumFractionDigits={2}
                minimunFractionDigits={2}
                value={account.productivity} />%
            </Fragment>
          ) : '-'
        }

      </td>
    </tr>
  )
}

function mapStateToProps(state) {
  return {
    witnesses: state.network.witnesses,
  };
}

const mapDispatchToProps = {
  loadWitnesses,
};

export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(injectIntl(Representatives));
//export default connect(mapStateToProps, mapDispatchToProps)(Representatives)
