import React, {Component} from 'react';
import {connect} from "react-redux";
import {loadTokens} from "../../../actions/tokens";
import {FormattedDate, FormattedNumber, FormattedTime, FormattedRelative, injectIntl} from "react-intl";
import SweetAlert from "react-bootstrap-sweetalert";
import {t, tu} from "../../../utils/i18n";
import {trim} from "lodash";
import {Client} from "../../../services/api";
import {getQueryParam} from "../../../utils/url";
import {TokenLink} from "../../common/Links";
import SearchInput from "../../../utils/SearchInput";
import {toastr} from 'react-redux-toastr'
import SmartTable from "../../common/SmartTable.js"
import {ONE_TRX} from "../../../constants";
import {login} from "../../../actions/app";
import {reloadWallet} from "../../../actions/wallet";
import {upperFirst} from "lodash";
import {TronLoader} from "../../common/loaders";
import xhr from "axios/index";

class TokenOverview extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tokens: [],
      buyAmount: 0,
      loading: false,
      total: 0,
      filter: {},
    };

    let nameQuery = trim(getQueryParam(props.location, "search"));
    if (nameQuery.length > 0) {
      this.state.filter.name = `%25${nameQuery}%25`;
    }
  }

  loadPage = async (page = 1, pageSize = 10) => {
    let {filter} = this.state;
    let {intl} = this.props;
    this.setState({loading: true});

    let result;

    if (filter.name)
      result = await xhr.get("https://www.tronapp.co:9009/api/token?sort=-name&limit=" + pageSize + "&start=" + (page - 1) * pageSize + "&status=ico" + "&name=" + filter.name);
    else
      result = await xhr.get("https://www.tronapp.co:9009/api/token?sort=-name&limit=" + pageSize + "&start=" + (page - 1) * pageSize + "&status=ico");

    let total = result.data.data['Total'];
    let tokens = result.data.data['Data'];
    /*
        let {tokens, total} = await Client.getTokens({
          sort: '-name',
          limit: pageSize,
          start: (page - 1) * pageSize,
          status: 'ico',
          ...filter,
        });
    */
    if (tokens.length === 0) {
      toastr.warning(intl.formatMessage({id: 'warning'}), intl.formatMessage({id: 'record_not_found'}));
    }

    this.setState({
      loading: false,
      tokens,
      total,
    });
    return total;
  };

  componentDidMount() {
    this.loadPage();
  }

  setSearch = () => {
    let nameQuery = trim(getQueryParam(this.props.location, "search"));
    if (nameQuery.length > 0) {
      this.setState({
        filter: {
          name: `%25${nameQuery}%25`,
        }
      });
    } else {
      this.setState({
        filter: {},
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.location !== prevProps.location) {
      this.setSearch();
    }
    if (this.state.filter !== prevState.filter) {
      console.log("SEARCH CHANGED!");
      this.loadPage();
    }
  }

  onChange = (page, pageSize) => {
    this.loadPage(page, pageSize);
  };

  searchName = (name) => {

    if (name.length > 0) {
      this.setState({
        filter: {
          name: `%25${name}%25`,
        }
      });
    }
    else {
      if (window.location.hash !== '#/tokens/view')
        window.location.hash = '#/tokens/view';
      else {
        this.setState({
          filter: {},
        });
      }
    }
  }

  onBuyInputChange = (value, price, max) => {
    let {intl} = this.props;
    if (value > max) {
      value = max;
    }
    this.setState({buyAmount: value});
    this.buyAmount.value = value;
    let priceTRX = value * (price / ONE_TRX);
    this.priceTRX.innerHTML = intl.formatNumber(priceTRX) + ' TRX';
  }

  preBuyTokens = (token) => {
    let {buyAmount} = this.state;
    let {currentWallet, wallet} = this.props;

    if (!wallet.isOpen) {
      this.setState({
        alert: (
            <SweetAlert
                info
                showConfirm={false}
                style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
            >
              <div className="token-sweet-alert">
                <a className="close" onClick={() => {
                  this.setState({alert: null})
                }}><i className="fa fa-times" ariaHidden="true"></i></a>
                <span>{tu('login_first')}</span>
                <button className="btn btn-danger btn-block mt-3" onClick={() => {
                  this.setState({alert: null})
                }}>{tu("OK")}</button>
              </div>

            </SweetAlert>
        ),
      });
      return;
    }
    else {
      this.setState({
        alert: (
            <SweetAlert
                showConfirm={false}
                style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
            >
              <div className="mt-5 token-sweet-alert" style={{textAlign: 'left'}}>
                <a style={{float: 'right', marginTop: '-45px'}} onClick={() => {
                  this.setState({alert: null})
                }}><i className="fa fa-times" ariaHidden="true"></i></a>
                <h5 style={{color: 'black'}}>{tu('buy_token_info')}</h5>
                {token.remaining === 0 && <span> {tu('no_token_to_buy')}</span>}
                <div className="input-group mt-5">
                  <input
                      type="number"
                      ref={ref => this.buyAmount = ref}
                      className="form-control"
                      max={token.remaining}
                      min={1}
                      onChange={(e) => {
                        this.onBuyInputChange(e.target.value, token.price, token.remaining)
                      }}
                  />
                </div>
                <div className="text-center mt-3 text-muted">
                  <b>= <span ref={ref => this.priceTRX = ref}>0 TRX</span></b>
                </div>
                <button className="btn btn-danger btn-block mt-3" onClick={() => {
                  this.buyTokens(token)
                }}>{tu("participate")}</button>
              </div>
            </SweetAlert>
        ),
      });
    }
  }
  buyTokens = (token) => {

    let {buyAmount} = this.state;
    if (buyAmount <= 0) {
      return;
    }
    let {currentWallet, wallet} = this.props;
    let tokenCosts = buyAmount * (token.price / ONE_TRX);

    if ((currentWallet.balance / ONE_TRX) < tokenCosts) {
      this.setState({
        alert: (
            <SweetAlert
                warning
                showConfirm={false}
                style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
            >
              <div className="mt-5 token-sweet-alert">
                <a style={{float: 'right', marginTop: '-155px'}} onClick={() => {
                  this.setState({alert: null})
                }}><i className="fa fa-times" ariaHidden="true"></i></a>
                <span>
                  {tu("not_enough_trx_message")}
                </span>
                <button className="btn btn-danger btn-block mt-3" onClick={() => {
                  this.setState({alert: null})
                }}>{tu("confirm")}</button>
              </div>
            </SweetAlert>
        ),
      });
    } else {
      this.setState({
        alert: (
            <SweetAlert
                warning
                showConfirm={false}
                style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
            >
              <div className="mt-5 token-sweet-alert">
                <a style={{float: 'right', marginTop: '-155px'}} onClick={() => {
                  this.setState({alert: null})
                }}><i className="fa fa-times" ariaHidden="true"></i></a>
                <h5 style={{color: 'black'}}>{tu("buy_confirm_message_1")}</h5>
                <span>
                {buyAmount} {token.name} {t("for")} {buyAmount * (token.price / ONE_TRX)} TRX?
                </span>
                <button className="btn btn-danger btn-block mt-3" onClick={() => {
                  this.confirmTransaction(token)
                }}>{tu("confirm")}</button>
              </div>
            </SweetAlert>
        ),
      });
    }
  };
  submit = async (token) => {

    let {account, currentWallet} = this.props;
    let {buyAmount, privateKey} = this.state;

    let isSuccess = await Client.participateAsset(
        currentWallet.address,
        token.ownerAddress,
        token.name,
        buyAmount * token.price)(account.key);

    if (isSuccess.success) {
      this.setState({
        activeToken: null,
        confirmedParticipate: true,
        participateSuccess: isSuccess.success,
        buyAmount: 0,
      });
      this.props.reloadWallet();
      return true;
    } else {
      return false;
    }
  };

  confirmTransaction = async (token) => {
    let {account, intl} = this.props;
    let {buyAmount} = this.state;
    this.setState({
      alert: (
          <SweetAlert
              showConfirm={false}
              showCancel={false}
              cancelBtnBsStyle="default"
              title={intl.formatMessage({id: 'transferring'})}
              style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
          >
          </SweetAlert>
      ),
    });

    if (await this.submit(token)) {

      this.setState({
        alert: (
            <SweetAlert
                success
                showConfirm={false}
                style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
            >
              <div className="mt-5 token-sweet-alert">
                <a style={{float: 'right', marginTop: '-155px'}} onClick={() => {
                  this.setState({alert: null})
                }}><i className="fa fa-times" ariaHidden="true"></i></a>
                <h5 style={{color: 'black'}}>{tu('transaction')} {tu('confirm')}</h5>
                <span>
               {tu('success_receive')} {token.name} {tu('tokens')}
              </span>
                <button className="btn btn-danger btn-block mt-3" onClick={() => {
                  this.setState({alert: null})
                }}>{tu("OK")}</button>
              </div>

            </SweetAlert>
        )
      });
    } else {
      this.setState({
        alert: (
            <SweetAlert danger title="Error" onConfirm={() => this.setState({alert: null})}>
              {tu('fail_transaction')}
            </SweetAlert>
        )
      });
    }
  };

  customizedColumn = () => {
    let {intl} = this.props;
    let column = [
      {
        title: '#',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        className: 'ant_table _text_nowrap',
      },
      {
        title: upperFirst(intl.formatMessage({id: 'token'})),
        dataIndex: 'name',
        key: 'name',
        width: '40%',
        render: (text, record, index) => {
          return <div className="table-imgtext">
            {record.imgUrl ?
                <div style={{width: '42px', height: '42px', marginRight: '18px'}}><img
                    style={{width: '42px', height: '42px'}} src={record.imgUrl}/></div> :
                <div style={{width: '42px', height: '42px', marginRight: '18px'}}><img
                    style={{width: '42px', height: '42px'}} src={require('../../../images/logo_default.png')}/></div>
            }
            <div>
              <h5><TokenLink name={record.name}
                             namePlus={record.name + ' (' + record.abbr + ')'}/>
              </h5>
              <p>{record.description}</p>
            </div>
          </div>
        }
      },
      {
        title: intl.formatMessage({id: 'fund_raised'}),
        render: (text, record, index) => {
          return <div><FormattedNumber value={record.participated / ONE_TRX}/> TRX</div>
        },
        align: 'center',
        className: 'ant_table d-none d-md-table-cell _text_nowrap'
      },

      {
        title: intl.formatMessage({id: 'issue_progress'}),
        dataIndex: 'issuedPercentage',
        key: 'issuedPercentage',
        render: (text, record, index) => {
          if (text === null)
            text = 0;
          return <div><FormattedNumber value={text}/>%</div>
        },
        align: 'center',
        className: 'ant_table d-none d-sm-table-cell _text_nowrap'
      },
      {
        title: intl.formatMessage({id: 'end_time'}),
        dataIndex: 'endTime',
        key: 'endTime',
        align: 'center',
        className: 'ant_table _text_nowrap',
        render: (text, record, index) => {
          return <div>
            <FormattedRelative value={record.endTime} units="day"/>
          </div>
        }
      },
      {
        title: intl.formatMessage({id: 'issuing_price'}),
        render: (text, record, index) => {
          return <div><FormattedNumber value={record.price / ONE_TRX} maximumFractionDigits={6}/> TRX</div>
        },
        align: 'center',
        className: 'ant_table'
      },
      {
        title: intl.formatMessage({id: 'participate'}),
        align: 'center',
        render: (text, record, index) => {
          if (record.endTime < new Date() || record.issuedPercentage === 100)
            return <span style={{fontWeight: 'normal'}}>{tu("finish")}</span>
          else if (record.startTime > new Date())
            return <span style={{fontWeight: 'normal'}}>{tu("not_started")}</span>
          else
            return <button className="btn btn-default btn-block btn-sm"
                           onClick={() => this.preBuyTokens(record)}>{tu("participate")}</button>
        },
        className: 'ant_table'
      }
    ];

    return column;
  }


  render() {

    let {tokens, alert, loading, total} = this.state;
    let {match, intl} = this.props;
    let column = this.customizedColumn();
    let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'view_pass'})

    return (
        <main className="container header-overlap token_black">
          {alert}
          {loading && <div className="loading-style"><TronLoader/></div>}
          {
            <div className="row">

              <div className="col-md-12 table_pos">
                {total ? <div className="table_pos_info" style={{left: 'auto'}}>{tableInfo}</div> : ''}
                <SmartTable bordered={true} loading={loading} column={column} data={tokens} total={total}
                            rowClassName="table-row" onPageChange={(page, pageSize) => {
                  this.loadPage(page, pageSize)
                }}/>
              </div>
            </div>
          }
        </main>

    )
  }
}

function mapStateToProps(state) {
  return {
    account: state.app.account,
    tokens: state.tokens.tokens,
    wallet: state.wallet,
    currentWallet: state.wallet.current,
  };
}

const mapDispatchToProps = {
  loadTokens,
  login,
  reloadWallet
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TokenOverview));
