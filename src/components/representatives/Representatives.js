import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { loadWitnesses, loadStatisticData } from "../../actions/network";
import { tu } from "../../utils/i18n";
import { TronLoader } from "../common/loaders";
import { FormattedNumber } from "react-intl";
import { injectIntl } from "react-intl";
import _, { filter, maxBy, sortBy, trim, sumBy, slice } from "lodash";
import { AddressLink, BlockNumberLink } from "../common/Links";
import { SR_MAX_COUNT, IS_MAINNET } from "../../constants";
import { RepresentativesRingPieReact } from "../common/RingPieChart";
import { Link } from "react-router-dom";
import { Client } from "../../services/api";
import { Tooltip } from "antd";
import { QuestionMark } from "../common/QuestionMark";

class Representatives extends Component {
  constructor() {
    super();
    this.state = {
      latestBlock: ""
    };
  }

  componentDidMount() {
    this.props.loadWitnesses();
    this.props.loadStatisticData();
    this.getLatestBlock();
  }
  getPiechart() {
    let { intl } = this.props;
    let { statisticData } = this.props;
    let pieChartData = [];
    if (statisticData.length > 0) {
      statisticData.map((val, i) => {
        pieChartData.push({
          key: i + 1,
          name: val.name ? val.name : val.url,
          address: val.address,
          volumeValue: val.blockProduced,
          volumePercentage:
            intl.formatNumber(val.percentage * 100, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            }) + "%"
        });
      });
    }
    return pieChartData;
  }

  getLatestBlock = async () => {
    let latestBlock = await Client.getLatestBlock();
    this.setState({
      latestBlock: latestBlock.number
    });
  };
  renderWitnesses(witnesses) {
    let { latestBlock } = this.state;
    let {intl} = this.props;
    if (witnesses.length === 0) {
      return (
        <div className="card">
          <TronLoader>{tu("loading_representatives")}</TronLoader>
        </div>
      );
    }

    let superRepresentatives = sortBy(
      filter(witnesses, w => w.producer),
      w => w.votes * -1
    );
    let candidateRepresentativesArr = sortBy(
      filter(witnesses, w => !w.producer),
      w => w.votes * -1
    );
    let partnersRepresentatives = slice(candidateRepresentativesArr, 0, 100);
    let candidateRepresentatives = slice(candidateRepresentativesArr, 100);
    superRepresentatives.map(account => {
      Number(latestBlock) - account.latestBlockNumber < 1000
        ? (account.representerStatus = true)
        : (account.representerStatus = false);
    });
    let locale = intl.locale;
    return (
      <div className={locale == 'ru' ? "card border-0 represent__table w-1000 represent__table-ru" : "card border-0 represent__table w-1000"} >
        <table
          className="table table-hover table-striped bg-white m-0 sr"
          style={{ border: "1px solid #DFD7CA" }}
        >
          <thead className="thead-dark">
            <tr>
              <th className="text-center">{tu("SR_rank")}</th>
              <th>{tu("name")}</th>
              <th>{tu("current_version")}</th>
              <th className="text-center text-nowrap">{tu("status")}</th>
              <th className="text-center text-nowrap d-none d-lg-table-cell">
                {tu("last_block")}
              </th>
              <th className="text-center text-nowrap d-none d-lg-table-cell">
                {tu("blocks_produced")}
              </th>
              <th className="text-center text-nowrap d-none d-lg-table-cell">
                {tu("SR_blocksMissed")}
              </th>
              {/* <th className="text-center text-nowrap">{tu("transactions")}</th> */}
              <th className="text-center text-nowrap">{tu("productivity")}</th>
              <th
                className="text-right text-nowrap"
              >
                {tu("SR_votes")}
              </th>
              <th
                className="text-right text-nowrap"
                style={{ borderRight: "1px solid rgb(223, 215, 202)" }}
              >
                {tu("SR_voteRatio")}
                <span className="ml-2">
                  <QuestionMark placement="top" text="voting_brokerage_tip" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ height: "72px" }}>
              <td colSpan="10" className="font-weight-bold">
                <i
                  className="fa fa-trophy mr-2 ml-2"
                  style={{ color: "#666" }}
                ></i>
                {tu("Super Representatives")}
              </td>
            </tr>
            {superRepresentatives.map((account, index) => (
              <Row
                index={index}
                state={this.state}
                props={this.props}
                key={account.address + index}
                account={account}
              />
            ))}
            <tr style={{ height: "72px" }}>
              <td colSpan="10" className="font-weight-bold">
                <i
                  className="far fa-handshake mr-2 ml-2"
                  style={{ color: "#666" }}
                ></i>
                {tu("Super Representative Partners")}
              </td>
            </tr>
            {partnersRepresentatives.map((account, index) => (
              <Row
                index={
                  superRepresentatives
                    ? index + superRepresentatives.length
                    : IS_MAINNET
                    ? index + 27
                    : index + 5
                }
                state={this.state}
                props={this.props}
                key={account.address + index}
                account={account}
                showSync={false}
              />
            ))}
            {IS_MAINNET && (
              <tr style={{ height: "72px" }}>
                <td colSpan="9" className="font-weight-bold">
                  <i
                    className="fa fa-user mr-2 ml-2"
                    style={{ color: "#666" }}
                  ></i>
                  {tu("Super Representative Candidates")}
                </td>
              </tr>
            )}
            {candidateRepresentatives &&
              candidateRepresentatives.map((account, index) => (
                <Row
                  index={
                    superRepresentatives
                      ? index +
                        superRepresentatives.length +
                        partnersRepresentatives.length
                      : IS_MAINNET
                      ? index + 127
                      : index + 5
                  }
                  state={this.state}
                  props={this.props}
                  key={account.address + index}
                  account={account}
                  showSync={false}
                />
              ))}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    let { intl, witnesses } = this.props;
    let pieChart = this.getPiechart();
    let productivityWitnesses = witnesses.slice(0, SR_MAX_COUNT);
    let mostProductive = sortBy(
      productivityWitnesses,
      w => w.producePercentage * -1
    )[0];
    let leastProductive = _(productivityWitnesses)
      .filter(w => w.producedTotal > 0)
      .sortBy(w => w.producePercentage)
      .value()[0];
      leastProductive = leastProductive ? leastProductive : {}

    return (
      <main className="container header-overlap pb-3 token_black">
        <div
          className={
            witnesses.length === 0 || pieChart.length === 0 ? "card" : ""
          }
        >
          {witnesses.length === 0 || pieChart.length === 0 ? (
            <TronLoader />
          ) : (
            <div className="row">
              <div className="col-md-6 foundation_title represent_title">
                <div className="mb-3">
                  <div className="card h-100 widget-icon">
                    <div className="card-body">
                      <h3 className="text-primary">
                        <FormattedNumber value={witnesses.length} />
                      </h3>
                      {tu("Super Representatives")}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h3>
                        <FormattedNumber
                          value={mostProductive.producePercentage}
                        />
                        %
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
                        <FormattedNumber
                          maximumFractionDigits={2}
                          minimunFractionDigits={2}
                          value={leastProductive.producePercentage || 0}
                        />
                        %
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
                  <div
                    style={{ height: 326, background: "#fff" }}
                    className="pt-2 bg-line_blue"
                  >
                    <div
                      className="card-header bg-tron-light color-grey-100 text-center pb-0"
                      style={{ border: 0 }}
                    >
                      <h6 className="m-0 lh-150" style={{ fontSize: 16 }}>
                        <Link to="/blockchain/stats/pieChart">
                          {tu("produce_distribution")}
                        </Link>
                      </h6>
                    </div>
                    <div className="card-body pt-0">
                      <div style={{ minWidth: 255, height: 200 }}>
                        {
                          <RepresentativesRingPieReact
                            message={{ id: "produce_distribution" }}
                            intl={intl}
                            data={pieChart}
                            style={{ height: 255 }}
                            source="representatives"
                          />
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* </div> */}
            </div>
          )}
        </div>

        <div className=" mt-3">
          <div className=" table-scroll">{this.renderWitnesses(witnesses)}</div>
        </div>
      </main>
    );
  }
}

function Row({ account, showSync = true, index, state, props }) {
  return (
    <tr
      key={account.address}
      className={
        account.index > 26
          ? "represent__table__lighter"
          : "represent__table__content"
      }
    >
      <td className="text-center" style={{ paddingLeft: "14px" }}>
        {index + 1}
      </td>
      <td>
        {account.name ? (
          <div
            className="_context_right_click font-weight-bold"
            style={{ width: "150px" }}
          >
            <AddressLink address={account.address}>
              {account.name}
              <br />
              <span className="small text-muted">{account.url}</span>
            </AddressLink>
          </div>
        ) : (
          <div className="_context_right_click">
            <AddressLink address={account.address}>{account.url}</AddressLink>
          </div>
        )}
      </td>
      <td className="text-center">{account.version || '-'}</td>
      {showSync ? (
        <td className="text-center">
          {account.representerStatus ? (
            <Tooltip placement="top" title={tu("SR_normal")}>
              <span key="no" className="text-success">
                <i className="fas fa-circle" />
              </span>
            </Tooltip>
          ) : (
            <Tooltip placement="top" title={tu("SR_avnormal")}>
              <span key="yes" className="text-danger">
                <i className="fas fa-circle" />
              </span>
            </Tooltip>
          )}
        </td>
      ) : (
        <td>&nbsp;</td>
      )}
      <td className="text-center  d-none d-lg-table-cell">
        {account.latestBlockNumber ? (
          <BlockNumberLink number={account.latestBlockNumber} />
        ) : (
          "-"
        )}
      </td>
      <td className="text-center d-none d-lg-table-cell">
        {account.producedTotal ? (
          <FormattedNumber value={account.producedTotal} />
        ) : (
          "-"
        )}
      </td>
      <td className="text-center d-none d-lg-table-cell">
        {account.missedTotal !== 0 ? (
          <FormattedNumber value={account.missedTotal} />
        ) : (
          "-"
        )}
      </td>
      {/* <td className="text-center">
          {
            account.producedTrx !== 0 ?
                <FormattedNumber value={account.producedTrx}/> :
                '-'
          }
        </td> */}
      <td className="text-center">
        {account.producedTotal > 0 ? (
          <Fragment>
            {/*<FormattedNumber*/}
            {/*maximumFractionDigits={3}*/}
            {/*minimunFractionDigits={2}*/}
            {/*value={}/>%*/}
            {Math.floor(account.producePercentage * 100) / 100}%
          </Fragment>
        ) : (
          "-"
        )}
      </td>
      <td className="text-right">
        {
          <Fragment>
            <FormattedNumber value={account.votes || 0} />
            <br />
            {"("}
            <FormattedNumber
              minimumFractionDigits={2}
              maximumFractionDigits={2}
              value={account.votesPercentage}
            />
            %{")"}
          </Fragment>
        }
      </td>
      <td className="text-right">
        {
          <Fragment>
            <span>
              {account.brokerage || account.brokerage == 0
                ? 100 - account.brokerage + "%"
                : ""}
            </span>
          </Fragment>
        }
      </td>
    </tr>
  );
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { pure: false }
)(injectIntl(Representatives));
//export default connect(mapStateToProps, mapDispatchToProps)(Representatives)
