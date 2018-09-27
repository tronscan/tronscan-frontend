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
import {RepresentativesRingPieReact} from "../common/RingPieChart";
import {Link} from "react-router-dom";

class Representatives extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.props.loadWitnesses();
    this.props.loadStatisticData();
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
        <div className="card border-0 represent__table">
          <table className="table table-hover table-striped bg-white m-0 sr" style={{border: '1px solid #DFD7CA'}}>
            <thead className="thead-dark">
            <tr>
              <th className="text-center d-none d-lg-table-cell" style={{width: 20}}>#</th>
              <th style={{width: 60}}>{tu("name")}</th>
              <th className="text-center text-nowrap">{tu("status")}</th>
              <th className="text-center text-nowrap d-none d-sm-table-cell">{tu("last_block")}</th>
              <th className="text-center text-nowrap d-none d-md-table-cell">{tu("blocks_produced")}</th>
              <th className="text-center text-nowrap d-none d-xl-table-cell">{tu("blocks_missed")}</th>
              {/* <th className="text-center text-nowrap d-none d-xl-table-cell">{tu("transactions")}</th> */}
              <th className="text-center text-nowrap d-none d-xl-table-cell">{tu("productivity")}</th>
              <th className="text-right text-nowrap d-none d-xl-table-cell">{tu("votes")}</th>

            </tr>
            </thead>
            <tbody>
            <tr style={{height: '72px'}}>
              <td colSpan="9" className="font-weight-bold">
                <i className="fa fa-trophy mr-2 ml-2" aria-hidden="true" style={{color: '#666'}}></i>
                {tu("Super Representatives")}
              </td>
            </tr>
            {superRepresentatives.map((account, index) => <Row index={index} state={this.state} props={this.props}
                                                               key={account.address} account={account}/>)}
            <tr style={{height: '72px'}}>
              <td colSpan="9" className="font-weight-bold">
                <i className="fa fa-user mr-2 ml-2" aria-hidden="true" style={{color: '#666'}}></i>
                {tu("Super Representative Candidates")}
              </td>
            </tr>
            {candidateRepresentatives.map((account, index) => <Row index={index + 27} state={this.state}
                                                                   props={this.props} key={account.address}
                                                                   account={account} showSync={false}/>)}
            </tbody>
          </table>
        </div>
    )
  }

  render() {
    let {intl,witnesses} = this.props;
    let pieChart = this.getPiechart();
    let productivityWitnesses = witnesses.slice(0, SR_MAX_COUNT);
    let mostProductive = sortBy(productivityWitnesses, w => w.producePercentage * -1)[0];
    let leastProductive = _(productivityWitnesses)
        .filter(w => w.producedTotal > 0)
        .sortBy(w => w.producePercentage)
        .value()[0];

    return (
        <main className="container header-overlap pb-3 token_black">
          <div className={witnesses.length === 0 || pieChart.length === 0 ? 'card' : ''}>
            {
              witnesses.length === 0 || pieChart.length === 0 ?
                  <TronLoader/> :
                  <div className="row">
                    <div className="col-md-6 foundation_title represent_title">
                      <div className="mb-3">
                        <div className="card h-100 widget-icon">
                          <div className="card-body">
                            <h3 className="text-primary">
                              <FormattedNumber value={witnesses.length}/>
                            </h3>
                            {tu("representativesAcandidates")}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="card h-100">
                          <div className="card-body">
                            <h3>
                              <FormattedNumber value={mostProductive.producePercentage}/>%
                            </h3>
                            <div className="represent_title_text">
                              <span>{tu("highest_productivity")} - </span>
                              <AddressLink address={mostProductive.address}>
                                {mostProductive.name || mostProductive.url}
                              </AddressLink>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="card h-100 widget-icon">
                          <div className="card-body">
                            <h3>
                              <FormattedNumber maximumFractionDigits={2}
                                               minimunFractionDigits={2}
                                               value={leastProductive.producePercentage}/>%
                            </h3>
                            <div className="represent_title_text">
                              <span>{tu("lowest_productivity")} - </span>
                              <AddressLink address={leastProductive.address}>
                                {leastProductive.name || leastProductive.url}
                              </AddressLink>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="card">
                        <div style={{height: 326, background: '#fff'}} className="pt-2 bg-line_blue">
                          <div className="card-header bg-tron-light color-grey-100 text-center pb-0" style={{border:0}}>
                            <h6 className="m-0 lh-150" style={{fontSize:16}}>
                              <Link to="blockchain/stats/pieChart">
                                  {tu("produce_distribution")}
                              </Link>
                            </h6>
                          </div>
                          <div className="card-body pt-0">
                            <div style={{minWidth: 255, height: 200}}>
                                {
                                  <RepresentativesRingPieReact message={{id: 'produce_distribution'}} intl={intl}
                                                               data={pieChart} style={{height: 255}}
                                                               source='representatives'
                                  />
                                }
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                    {/* </div> */}
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

  return (
      <tr key={account.address}
          className={(account.index > 26) ? 'represent__table__lighter' : 'represent__table__content'}>
        <td className="text-center d-none d-lg-table-cell" style={{paddingLeft: '14px'}}>{index + 1}</td>
        <td>
          {
            account.name ?
                <div className="_context_right_click" style={{width: '250px'}}>
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
                  account.producer ?
                      <span key="no" className="text-success"><i className="fas fa-circle"/></span> :
                      <span key="yes" className="text-danger"><i className="fa fa-times"/></span>
                }
              </td> : <td>&nbsp;</td>
        }
        <td className="text-center d-none d-sm-table-cell">
          <BlockNumberLink number={account.latestBlockNumber}/>
        </td>
        <td className="text-center d-none d-md-table-cell">
          <FormattedNumber value={account.producedTotal}/>
        </td>
        <td className="text-center d-none d-xl-table-cell">
          {
            account.missedTotal !== 0 ?
                <FormattedNumber value={account.missedTotal}/> :
                '-'
          }
        </td>
        {/* <td className="text-center d-none d-xl-table-cell">
          {
            account.producedTrx !== 0 ?
                <FormattedNumber value={account.producedTrx}/> :
                '-'
          }
        </td> */}
        <td className="text-center d-none d-xl-table-cell">
          {
            account.producedTotal > 0 ? (
                <Fragment>
                  <FormattedNumber
                      maximumFractionDigits={2}
                      minimunFractionDigits={2}
                      value={account.producePercentage}/>%
                </Fragment>
            ) : '-'
          }

        </td>
        <td className="text-right d-none d-xl-table-cell">
          {
            <Fragment>
              <FormattedNumber value={account.votes}/>
              {'('}
              <FormattedNumber
                  minimumFractionDigits={2}
                  maximumFractionDigits={2}
                  value={account.votesPercentage}/>%
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
    statisticData: state.network.statisticData
  };
}

const mapDispatchToProps = {
  loadWitnesses,
  loadStatisticData
};

export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(injectIntl(Representatives));
//export default connect(mapStateToProps, mapDispatchToProps)(Representatives)
