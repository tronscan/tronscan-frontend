import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {loadWitnesses, loadStatisticData} from "../../actions/network";
import {tu} from "../../utils/i18n";
import {TronLoader} from "../common/loaders";
import {FormattedNumber} from "react-intl";
import {injectIntl} from "react-intl";
import _, {filter, maxBy, sortBy, trim, sumBy} from "lodash";
import {AddressLink, BlockNumberLink} from "../common/Links";
import {SR_MAX_COUNT} from "../../constants";
import {WidgetIcon} from "../common/Icon";
import {RepresentativesRingPieReact} from "../common/RingPieChart";
import {loadVoteList, loadVoteTimer} from "../../actions/votes";

class Representatives extends Component {
  constructor() {
    super();
    this.state = {
      searchCriteria: "",
    };
  }

  componentDidMount() {
    this.props.loadVoteList()
    this.props.loadVoteTimer();
    this.props.loadWitnesses();
    this.props.loadStatisticData();
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
        .map((w, index) => ({...w, index}));
  }

  isinSync(account) {
    let {witnesses} = this.props;
    let maxBlockNumber = maxBy(witnesses, witness => witness.latestBlockNumber).latestBlockNumber;
    return account.latestBlockNumber > maxBlockNumber - SR_MAX_COUNT;
  }

  getPiechart() {
    let {intl} = this.props;
    let {statisticData} = this.props;
    let pieChartData = [];
    if (statisticData.length > 0) {
      statisticData.map((val, i) => {
        pieChartData.push({
          key: i + 1,
          name: val.name ? val.name : val.url,
          volumeValue: intl.formatNumber(val.blockProduced),
          volumePercentage: intl.formatNumber(val.percentage * 100, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          }) + '%',
        });

      })
    }
    return pieChartData
  }

  renderWitnesses(witnesses) {

    if (witnesses.length === 0 || this.props.voteList.length === 0) {
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
          <table className="table table-hover table-striped bg-white m-0 sr">
            <thead className="thead-dark">
            <tr>
              <th className="text-right d-none d-lg-table-cell" style={{width: 20}}>#</th>
              <th style={{width: 100}}>{tu("name")}</th>
              <th className="text-right text-nowrap">{tu("status")}</th>
              <th className="text-right text-nowrap d-none d-sm-table-cell">{tu("last_block")}</th>
              <th className="text-right text-nowrap d-none d-md-table-cell">{tu("blocks_produced")}</th>
              <th className="text-right text-nowrap d-none d-xl-table-cell">{tu("blocks_missed")}</th>
              <th className="text-right text-nowrap d-none d-xl-table-cell">{tu("transactions")}</th>
              <th className="text-right text-nowrap d-none d-xl-table-cell">{tu("productivity")}</th>
              <th className="text-right text-nowrap d-none d-xl-table-cell">{tu("votes")}</th>

            </tr>
            </thead>
            <tbody>
            <tr>
              <td colSpan="9" className="bg-danger text-white text-center font-weight-bold">
                {tu("Super Representatives")}
              </td>
            </tr>
            {superRepresentatives.map((account, index) => <Row index={index} state={this.state} props={this.props}
                                                               key={account.address} account={account}/>)}
            <tr>
              <td colSpan="9" className="bg-secondary text-white text-center font-weight-bold">
                {tu("Super Representative Candidates")}
              </td>
            </tr>
            {candidateRepresentatives.map((account, index) => <Row index={index+27} state={this.state} props={this.props}
                                                                   key={account.address} account={account}
                                                                   showSync={false}/>)}
            </tbody>
          </table>
        </div>
    )
  }

  render() {
    let {intl} = this.props;
    let witnesses = this.getWitnesses();
    let pieChart = this.getPiechart();

    let productivityWitnesses = witnesses.slice(0, SR_MAX_COUNT);

    let mostProductive = sortBy(productivityWitnesses, w => w.productivity * -1)[0];
    let leastProductive = _(productivityWitnesses)
        .filter(w => w.producedTotal > 0)
        .sortBy(w => w.productivity)
        .value()[0];

    return (
        <main className="container header-overlap pb-3">
          <div className={witnesses.length === 0 || pieChart.length === 0 ? 'card' : ''}>
            {
              witnesses.length === 0 || pieChart.length === 0 ?
                  <TronLoader/> :
                  <div className="row ">
                    <div className="col-md-6">
                      <div className="mt-3 mt-md-3">
                        <div className="card h-100 widget-icon">
                          <WidgetIcon className="fa fa-user-tie text-secondary"/>
                          <div className="card-body text-center">
                            <h3 className="text-primary">
                              <FormattedNumber value={witnesses.length}/>
                            </h3>
                            {tu("representatives")}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 mt-md-3">
                        <div className="card h-100">
                          <div className="card-body text-center widget-icon">
                            <WidgetIcon className="fa fa-arrow-up text-success" style={{bottom: 10}}/>
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
                          <WidgetIcon className="fa fa-arrow-down text-danger" style={{bottom: 10}}/>
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
                    <div className="col-md-6 mt-3">
                      <div className="card">
                        <div className="card-body">
                          <div style={{height: 330}}>
                            {
                              <RepresentativesRingPieReact message={{id: 'produce_distribution'}} intl={intl}
                                                           data={pieChart} style={{height: 300}}/>
                            }
                          </div>
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

function Row({account, showSync = true, index, state, props}) {

  let {searchCriteria} = state;
  let {voteList: candidates} = props;
  candidates = sortBy(candidates, c => c.votes * -1).map((c, index) => ({
    ...c,
    rank: index,
  }));

  let filteredCandidates = candidates;

  if (searchCriteria && searchCriteria !== "") {
    filteredCandidates = filter(candidates, c => {
      if (trim(c.url.toLowerCase()).indexOf(searchCriteria.toLowerCase()) !== -1) {
        return true;
      }

      if (c.name.length > 0 && trim(c.name.toLowerCase()).indexOf(searchCriteria.toLowerCase()) !== -1) {
        return true;
      }

      return false;
    });
  }

  let totalVotes = sumBy(candidates, c => c.votes);

  return (
      <tr key={account.address}>
        <td className="text-right d-none d-lg-table-cell">{account.index + 1}</td>
        <td>
          {
            account.name ?
                <div className="_context_right_click">
                  <AddressLink address={account.address}>
                    {account.name}<br/>
                    <span className="small text-muted">{account.url}</span>
                  </AddressLink>
                </div> :
                <div className="_context_right_click">
                  <AddressLink address={account.address}>{account.url}</AddressLink>
                </div>
          }
        </td>
        {
          showSync ?
              <td className="text-center">
                {
                  account.inSync ?
                      <span key="no" className="text-success"><i className="fas fa-circle"/></span> :
                      <span key="yes" className="text-danger"><i className="fa fa-times"/></span>
                }
              </td> : <td>&nbsp;</td>
        }
        <td className="text-right d-none d-sm-table-cell">
          <BlockNumberLink number={account.latestBlockNumber}/>
        </td>
        <td className="text-right d-none d-md-table-cell">
          <FormattedNumber value={account.producedTotal}/>
        </td>
        <td className="text-right d-none d-xl-table-cell">
          {
            account.missedTotal !== 0 ?
                <FormattedNumber value={account.missedTotal}/> :
                '-'
          }
        </td>
        <td className="text-right d-none d-xl-table-cell">
          {
            account.producedTrx !== 0 ?
                <FormattedNumber value={account.producedTrx}/> :
                '-'
          }
        </td>
        <td className="text-right d-none d-xl-table-cell">
          {
            account.producedTotal > 0 ? (
                <Fragment>
                  <FormattedNumber
                      maximumFractionDigits={2}
                      minimunFractionDigits={2}
                      value={account.productivity}/>%
                </Fragment>
            ) : '-'
          }

        </td>
        <td className="text-right d-none d-xl-table-cell">
          {
            totalVotes > 0 &&
            <Fragment>
              <FormattedNumber value={filteredCandidates[index].votes}/>
              <br/>
              {'('}
              <FormattedNumber
                  minimumFractionDigits={2}
                  maximumFractionDigits={2}
                  value={(filteredCandidates[index].votes / totalVotes) * 100}/>%
              {')'}
            </Fragment>
          }
        </td>
      </tr>
  )
}

function mapStateToProps(state) {
  return {
    witnesses: state.network.witnesses,
    statisticData: state.network.statisticData,
    voteList: state.voting.voteList,
    voteTimer: state.voting.voteTimer,
  };
}

const mapDispatchToProps = {
  loadWitnesses,
  loadStatisticData,
  loadVoteList,
  loadVoteTimer,
};

export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(injectIntl(Representatives));
//export default connect(mapStateToProps, mapDispatchToProps)(Representatives)
