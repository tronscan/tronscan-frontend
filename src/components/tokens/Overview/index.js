import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {filter, find, includes, sortBy, round} from "lodash";
import {loadTokens} from "../../../actions/tokens";
import {FormattedDate, FormattedNumber, FormattedRelative, FormattedTime, injectIntl} from "react-intl";
import {tu} from "../../../utils/i18n";
import {TextField} from "../../../utils/formHelper";
import {Client} from "../../../services/api";
import {ONE_TRX} from "../../../constants";
import {ExternalLink, TokenLink} from "../../common/Links";
import Avatar from "../../common/Avatar";
import {Sticky, StickyContainer} from "react-sticky";
import SweetAlert from "react-bootstrap-sweetalert";
import Paging from "../../common/Paging";
import {checkPageChanged} from "../../../utils/PagingUtils";
import {NumberField} from "../../common/Fields";

class TokenOverview extends Component {

  constructor() {
    super();

    this.state = {
      activeToken: null,
      alert: null,
      amount: "",
      confirmed: false,
      confirmedParticipate: false,
      participateSuccess: false,
      loading: false,
      viewMode: 'grid',
      filters: {
        active: true,
         waiting: true,
      },
      confirmVisible: false,
      total: 0,
      pageSize: 25,
      page: 0,
      tokens: [],
    };
  }

  toggleToken(token) {
    this.setState({
      activeToken: token,
      amount: 0,
      confirmed: false,
      confirmedParticipate: false,
      participateSuccess: false,
      loading: false,
    })
  }

  closeToken() {
    this.setState({
      activeToken: null,
      amount: 0,
      confirmed: false,
      confirmedParticipate: false,
      participateSuccess: false,
      loading: false,
    })
  }

  getTokenState = (token) => {
    let now = new Date().getTime();
    if (token.endTime < now || token.percentage === 100) {
      return 'finished';
    }

    if (token.startTime < now) {
      return 'active';
    }

    return 'waiting';
  };

  buyTokens = (token) => {
    let {amount} = this.state;
    let {wallet} = this.props;

    let tokenCosts = amount * (token.price / ONE_TRX);

    if (( wallet.balance / ONE_TRX) < tokenCosts) {
      this.setState({
        alert: (
          <SweetAlert
            warning
            title="Insufficient TRX"
            onConfirm={() => this.setState({ alert: null })}
          >
            You do not have enough TRX to buy so many tokens
          </SweetAlert>
        ),
      });
    } else {
      this.setState({
        alert: (
          <SweetAlert
            info
            showCancel
            confirmBtnText="Confirm Transaction"
            confirmBtnBsStyle="success"
            cancelBtnBsStyle="default"
            title="Are you sure?"
            onConfirm={() => this.confirmTransaction(token)}
            onCancel={() => this.setState({ alert: null })}
          >
            Are you sure you want to buy<br/>
            {amount} {token.name} for {amount * (token.price / ONE_TRX)} TRX?
          </SweetAlert>
        ),
      });
    }
  };

  containsToken(token) {
    let {activeToken} = this.state;

    if (!activeToken) {
      return false;
    }

    return activeToken.name === token.name;
  }

  loadPage = async (page = 0) => {

    this.setState({ loading: true });

    let {pageSize} = this.state;

    let {tokens, total} = await Client.getTokens({
      sort: '-name',
      limit: pageSize,
      start: page * pageSize,
      status: "ico",
    });

    this.setState({
      page,
      loading: false,
      tokens,
      total,
    });
  };

  componentDidMount() {
    this.loadPage();
  }

  componentDidUpdate() {
    checkPageChanged(this, this.loadPage);
  }

  isValid = () => {
    let {amount} = this.state;
    return (amount > 0);
  };

  submit = async (token) => {

    let {account} = this.props;
    let {amount} = this.state;

    this.setState({ loading: true });

    console.log("participate", token);

    let isSuccess = await Client.participateAsset(
      account.address,
      token.ownerAddress,
      token.name,
      amount * token.price)(account.key);

    this.setState({
      activeToken: null,
      confirmedParticipate: true,
      participateSuccess: isSuccess,
      loading: false,
    });
  };

  renderGrid() {
    let {account} = this.props;
    let {amount, tokens} = this.state;

    return (
      <div className="row">
        {
          tokens.map((token, index) => (
            <Fragment key={index + "-" + token.name}>
              <div className="col-12 col-sm-6 col-lg-4 mb-3">
                <div className="card token-card h-100">
                  <div className="card-body">
                    <h5 className="card-title break-word">
                      <Avatar value={token.name} size={25} className="float-right"/>
                      <TokenLink name={token.name}/>
                    </h5>
                    <p className="card-text break-word">
                      {token.description}
                    </p>
                    {/*<p className="mb-0">*/}
                      {/*<ExternalLink url={token.url} className="card-link text-primary text-center">*/}
                        {/*Visit Website*/}
                      {/*</ExternalLink>*/}
                    {/*</p>*/}
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <span className="text-success">
                        <FormattedNumber value={token.issued} className="text-success"/>&nbsp;
                      </span>
                      /&nbsp;
                      <span className="text-muted">
                        <FormattedNumber value={token.availableSupply}/>
                      </span>
                      <span className="float-right text-success">
                        {Math.ceil(token.issuedPercentage)}%
                      </span>
                      <div className="progress mt-1">
                        <div className="progress-bar bg-success" style={{width: token.issuedPercentage + '%'}}/>
                      </div>
                    </li>
                    <li className="list-group-item">
                      {
                        this.getTokenState(token) === 'active' &&
                        <div className="text-center">
                          ends&nbsp;
                          <FormattedRelative value={token.endTime} units="day"/>
                        </div>
                      }
                      {
                        this.getTokenState(token) === 'finished' &&
                        <button className="btn btn-link btn-block" disabled={true}>
                          Finished
                        </button>
                      }
                      {
                        this.getTokenState(token) === 'waiting' &&
                        <div className="text-center">
                          Starts <FormattedRelative value={token.endTime}/>
                        </div>
                      }
                    </li>
                  </ul>
                  {
                    (account.isLoggedIn && this.getTokenState(token) === 'active') && (
                      !this.containsToken(token) ?
                        <div className="card-footer bg-transparent border-top-0">
                          {
                            this.getTokenState(token) === 'finished' ?
                              <button className="btn btn-outline-secondary btn-block" disabled={true}>
                                Finished
                              </button> :
                              <button className="btn btn-block btn-outline-primary"
                                      onClick={() => this.toggleToken(token)}>
                                Participate
                              </button>
                          }
                        </div> :
                        <div className="card-footer bg-transparent border-top-0">
                          <div className="text-muted text-center">
                            {tu("how_much_buy_message")}<br/>
                            {tu("price")}: {(token.price / ONE_TRX)}
                          </div>
                          <div className="input-group mt-3">
                            <NumberField
                              className="form-control"
                              value={amount}
                              max={token.remaining}
                              min={1}
                              onChange={value => this.setState({ amount: value })}
                            />
                            <div className="input-group-append">
                              <button className="btn btn-success"
                                      type="button"
                                      disabled={!this.isValid()}
                                      onClick={() => this.buyTokens(token)}>
                                <i className="fa fa-check"/>
                              </button>
                            </div>
                          </div>
                          <div className="text-center mt-1 text-muted">
                            {/*<FormattedNumber value={amount} /> {token.name}<br/>*/}
                            =&nbsp;
                            <b><FormattedNumber value={amount * (token.price / ONE_TRX)}/> TRX</b>
                          </div>
                        </div>
                    )
                  }
                </div>
              </div>
            </Fragment>
          ))
        }

      </div>
    );
  }

  renderSmallDate(token) {

    let now = new Date().getTime();

    if (token.endTime < now) {
      return (
        <Fragment>
          <span className="text-muted">
            Finished&nbsp;
            <FormattedDate value={token.endTime}/>&nbsp;
            <FormattedTime value={token.endTime}/>
          </span>
        </Fragment>
      );
    }

    if (token.startTime < now) {
      return (
        <Fragment>
          <span className="text-muted">
            Started&nbsp;
            <FormattedDate value={token.startTime}/>&nbsp;
            <FormattedTime value={token.startTime}/>
          </span>
          {
            !this.containsToken(token) && <button
              className="btn btn-primary btn-sm float-right"
              onClick={() => this.toggleToken(token)}>
              {tu("participate")}
            </button>
          }

        </Fragment>
      )
    }

    return (
      <Fragment>
          <span className="text-muted">
            Starts&nbsp;
            <FormattedDate value={token.startTime}/>&nbsp;
            <FormattedTime value={token.startTime}/>
          </span>
      </Fragment>
    );
  }

  confirmTransaction = (token) => {
    this.setState({
      alert: (
        <SweetAlert success title="Transaction Confirmed" onConfirm={() => this.setState({ alert: null })}>
          Successfully received x tokens
        </SweetAlert>
      )
    });
    this.submit(token);
  };

  render() {

    let {alert, loading, total, pageSize, page} = this.state;
    let {match} = this.props;

    return (
      <Fragment>
        {alert}
          <StickyContainer className="container header-overlap pb-3">
            <Sticky>
              {
                ({style, isSticky}) => (
                  <div className={"row " + (isSticky ? " bg-white no-gutters p-2 border border-secondary  border-top-0" : "")} style={{zIndex: 1000, ...style}}>
                    <div className="col-sm-12">
                      <Paging loading={loading} url={match.url} total={total} pageSize={pageSize} page={page}  />
                    </div>
                  </div>
                )
              }
            </Sticky>
            <div className="row mt-3">
              <div className="col-sm-12">
                {this.renderGrid()}
              </div>
            </div>
          </StickyContainer>
      </Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    tokens: state.tokens.tokens,
    account: state.app.account,
    wallet: state.wallet.current,
  };
}

const mapDispatchToProps = {
  loadTokens,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TokenOverview));
