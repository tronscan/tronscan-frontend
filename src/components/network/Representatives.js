import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {loadWitnesses} from "../../actions/network";
import {tu} from "../../utils/i18n";
import {TronLoader} from "../common/loaders";
import {FormattedNumber} from "react-intl";
import _, {filter, maxBy, sortBy} from "lodash";
import {AddressLink, BlockNumberLink} from "../common/Links";
import {SR_MAX_COUNT} from "../../constants";
import {WidgetIcon} from "../common/Icon";

class Representatives extends Component {

  componentDidMount() {
    this.props.loadWitnesses();
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
              <th className="text-right text-nowrap">{tu("Status")}</th>
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

    let witnesses = this.getWitnesses();

    let productivityWitnesses = witnesses.slice(0, SR_MAX_COUNT);

    let mostProductive = sortBy(productivityWitnesses, w => w.productivity * -1)[0];
    let leastProductive = _(productivityWitnesses)
      .filter(w => w.producedTotal > 0)
      .sortBy(w => w.productivity)
      .value()[0];

    return (
      <main className="container header-overlap pb-3">
        {
          witnesses.length > 0 && <div className="row">
            <div className="col-md-4 mt-3 mt-md-0">
              <div className="card h-100 widget-icon">
                <WidgetIcon className="fa fa-user-tie text-secondary"  />
                <div className="card-body text-center">
                  <h3 className="text-primary">
                    <FormattedNumber value={witnesses.length}/>
                  </h3>
                  {tu("representatives")}
                </div>
              </div>
            </div>

            <div className="col-md-4 mt-3 mt-md-0">
              <div className="card h-100">
                <div className="card-body text-center widget-icon">
                  <WidgetIcon className="fa fa-arrow-up text-success" style={{right: -70}}  />
                  <h3 className="text-success">
                    <FormattedNumber value={mostProductive.productivity}/>%
                  </h3>
                  {tu("Highest Productivity")}<br/>
                  <AddressLink address={mostProductive.address}>
                    {mostProductive.name || mostProductive.url}
                  </AddressLink>
                </div>
              </div>
            </div>

            <div className="col-md-4 mt-3 mt-md-0">
              <div className="card h-100 widget-icon">
                <WidgetIcon className="fa fa-arrow-down text-danger" style={{right: -70}}  />
                <div className="card-body text-center">
                  <h3 className="text-danger">
                    <FormattedNumber value={leastProductive.productivity}/>%
                  </h3>
                  {tu("Lowest Productivity")}<br/>
                  <AddressLink address={leastProductive.address}>
                    {leastProductive.name || leastProductive.url}
                  </AddressLink>
                </div>
              </div>
            </div>
          </div>
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(Representatives)
