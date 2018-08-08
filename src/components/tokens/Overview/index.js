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
    let {account} = this.props;
    if(!account.isLoggedIn){
      this.setState({
        alert: (
            <SweetAlert
                warning
                confirmBtnText={tu("confirm")}
                confirmBtnCssClass="_confirm_button"
                title={tu("login_first")}
                onConfirm={() => this.setState({ alert: null })}
            >

            </SweetAlert>
        ),
      });
      return
    }
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
            {tu("not_enough_trx_message")}
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
      <div className="row pt-3">



        {
          tokens.map((token, index) => (
            <Fragment key={index + "-" + token.name}>
              <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-3 ">
                <div className="token-cards">
                  <div className="token-cards-top">
                    <div className="token-cards-header">
                          <div className="progress-bar-container">
                            <div className="progress mt-1">
                              <div className="progress-bar " style={{width: token.issuedPercentage + '%'}}/>
                            </div>
                            <div className="float-right token-card-percentage">
                              {Math.ceil(token.issuedPercentage)}%
                            </div>
                            <div className="token-amounts">
                              <span className="">
                                <FormattedNumber value={token.issued} className="text-success"/>&nbsp;
                              </span>
                                  /&nbsp;
                                  <span className="">
                                <FormattedNumber value={token.availableSupply}/>
                              </span>

                            </div>
                            <div className="float-right token-procentage">
                              {Math.ceil(token.issuedPercentage)}%
                            </div>
                          </div>


                        <div className="token-title">
                          <span>
                            {token.name}
                          </span>

                        </div>

                    </div>
                    <div className="token-description">
                      {token.description}
                    </div>
                    <div>
                      <div className="bottom-center">
                        <div className="">
                          {
                            this.getTokenState(token) === 'active' &&
                            <div className="text-center token-time">
                              {tu("ends")}&nbsp;
                              <FormattedRelative value={token.endTime} units="day"/>
                            </div>
                          }
                          {
                            this.getTokenState(token) === 'finished' &&
                            <div className="text-center token-time" disabled={true}>
                              {tu("finished")}
                            </div>
                          }
                          {
                            this.getTokenState(token) === 'waiting' &&
                            <div className="text-center token-time">
                              {tu("starts")} <FormattedRelative value={token.endTime}/>
                            </div>
                          }
                        </div>

                      </div>
                    </div>
                  </div>
                  <TokenLink  name={token.name}>
                    <div className="token-info">
                      More info
                    </div>
                  </TokenLink>
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
             // total > 0 &&
              <Sticky>
                {
                  ({style}) => (
                      <div style={{zIndex: 100, padding: 10, ...style}} className="card bg-white py-3 border">

                          <Paging onChange={this.onChange} loading={loading} url={match.url} total={total}/>

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
