import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {loadTokens} from "../../../actions/tokens";
import {FormattedDate, FormattedNumber, FormattedRelative, FormattedTime, injectIntl} from "react-intl";
import {tu,t} from "../../../utils/i18n";
import {Client} from "../../../services/api";
import {ONE_TRX} from "../../../constants";
import {TokenLink} from "../../common/Links";
import Avatar from "../../common/Avatar";
import {Sticky, StickyContainer} from "react-sticky";
import SweetAlert from "react-bootstrap-sweetalert";
import Paging from "../../common/Paging";
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

    if (token.endTime < now || token.issuedPercentage === 100) {
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
            title={tu("insufficient_trx")}
            onConfirm={() => this.setState({ alert: null })}
          >
            {tu("not_enouth_trx_message")}
          </SweetAlert>
        ),
      });
    } else {
      this.setState({
        alert: (
          <SweetAlert
            info
            showCancel
            confirmBtnText={tu("confirm_transaction")}
            confirmBtnBsStyle="success"
            cancelBtnText={tu("cancel")}
            cancelBtnBsStyle="default"
            title={tu("buy_confirm_message_0")}
            onConfirm={() => this.confirmTransaction(token)}
            onCancel={() => this.setState({ alert: null })}
          >
            {tu("buy_confirm_message_1")}<br/>
            {amount} {token.name} {t("for")} {amount * (token.price / ONE_TRX)} TRX?
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

  loadPage = async (page = 1,pageSize=40) => {

    this.setState({ loading: true });

    let {tokens, total} = await Client.getTokens({
      sort: '-name',
      limit: pageSize,
      start: (page-1) * pageSize,
      status: "ico",
    });

    function compare(property) {
      return function (obj1, obj2) {

        if (obj1[property] > obj2[property]) {
          return -1;
        } else if (obj1[property] < obj2[property] ) {
          return 1;
        } else {
          return 0;
        }

      }
    }
    tokens=tokens.sort(compare('issuedPercentage'));
    this.setState({
      loading: false,
      tokens,
      total,
    });
  };

  componentDidMount() {
    this.loadPage();
  }

  componentDidUpdate() {
    //checkPageChanged(this, this.loadPage);
  }
  onChange = (page,pageSize) => {
    this.loadPage(page,pageSize);
  };

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
                          {tu("ends")}&nbsp;
                          <FormattedRelative value={token.endTime} units="day"/>
                        </div>
                      }
                      {
                        this.getTokenState(token) === 'finished' &&
                        <button className="btn btn-link btn-block" disabled={true}>
                          {tu("finished")}
                        </button>
                      }
                      {
                        this.getTokenState(token) === 'waiting' &&
                        <div className="text-center">
                          {tu("starts")} <FormattedRelative value={token.endTime}/>
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
                                {tu("finished")}
                              </button> :
                              <button className="btn btn-block btn-outline-primary"
                                      onClick={() => this.toggleToken(token)}>
                                {tu("participate")}
                              </button>
                          }
                        </div> :
                        <div className="card-footer bg-transparent border-top-0">
                          <div className="text-muted text-center">
                            {tu("how_much_buy_message")}<br/>
                            {tu("price")}: {(token.price / ONE_TRX)} TRX
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
            {tu("finished")}&nbsp;
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
            {tu("starts")}&nbsp;
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
          Successfully received {token.name} tokens
        </SweetAlert>
      )
    });
    this.submit(token);
  };

  render() {

    let {alert, loading, total} = this.state;
    let {match} = this.props;

    return (
      <Fragment>
        {alert}
          <StickyContainer className="container header-overlap pb-3">
            {
              total > 0 &&
              <Sticky>
                {
                  ({style, isSticky}) => (
                      <div
                          className={"row " + (isSticky ? " bg-white no-gutters p-2 border border-secondary  border-top-0" : "")}
                          style={{zIndex: 1000, ...style}}>
                        <div className="col-sm-12">
                          <Paging onChange={this.onChange} loading={loading} url={match.url} total={total}/>
                        </div>
                      </div>
                  )
                }
              </Sticky>
            }
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
