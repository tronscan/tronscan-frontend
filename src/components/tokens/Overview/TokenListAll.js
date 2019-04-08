import React, {Component} from 'react';
import {connect} from "react-redux";
import {loadTokens} from "../../../actions/tokens";
import {FormattedDate, FormattedNumber, FormattedTime, injectIntl} from "react-intl";
import SweetAlert from "react-bootstrap-sweetalert";
import {t, tu} from "../../../utils/i18n";
import {trim} from "lodash";
import {Client} from "../../../services/api";
import {TokenLink} from "../../common/Links";
import {QuestionMark} from "../../common/QuestionMark";
import {getQueryParam} from "../../../utils/url";
import SearchInput from "../../../utils/SearchInput";
import {toastr} from 'react-redux-toastr'
import SmartTable from "../../common/SmartTable.js"
import {API_URL, ONE_TRX} from "../../../constants";
import {login} from "../../../actions/app";
import {reloadWallet} from "../../../actions/wallet";
import {upperFirst, toLower} from "lodash";
import {TronLoader} from "../../common/loaders";
import {transactionResultManager} from "../../../utils/tron";
import xhr from "axios/index";
import Lockr from "lockr";

import {withTronWeb} from "../../../utils/tronWeb";
import {Link} from "react-router-dom";
import { Button } from 'antd';



@withTronWeb
class TokenList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tokens: [],
      loading: false,
      total: 0,
      filter: {
        order: 'desc',
        filter: 'all',
        sort: 'marketcap'
      },
    };

    let nameQuery = trim(getQueryParam(props.location, "search"));
    if (nameQuery.length > 0) {
      this.state.filter.name = `${nameQuery}`;
    }
  }

  loadPage = async (page = 1, pageSize = 20) => {
    const {filter} = this.state
    const {data: {tokens, total}} = await xhr.get("http://52.15.68.74:8899/api/tokens/overview", {params: {
      start:  (page - 1) * pageSize,
      limit: pageSize,
      ...filter
    }});

    tokens.map((item,index) => {
      item.index = index + 1
      item.marketcap = item.marketcap || 0
      item.nrOfTokenHolders = item.nrOfTokenHolders || '-'
      item.volume24hInTrx =  item.volume24hInTrx|| 0
      item.priceInTrx = item.priceInTrx || '-'

      if(item.gain){
        item.gain = item.gain.toFixed(2)
        if(item.gain<0){
          item.color = 'col-red'
        }else{
          item.color = 'col-green'
          item.gain = '+' + item.gain
        }
        item.gain = item.gain + '%'
      }else{
        item.gain= '-'
      }
    })

    this.setState({
      loading: false,
      tokens,
      total
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
          name: `${nameQuery}`,
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

  onChange = (params) => {
    this.setState({
      filter: {
        ...this.state.filter,
        ...params
      }
    })
    this.loadPage();
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
      if (window.location.hash !== '#/tokens/list')
        window.location.hash = '#/tokens/list';
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
    value =  value.replace(/^0|[^\d*]/g,'')
    this.setState({buyAmount: value});
    this.buyAmount.value = value;
    let priceTRX = value * (price);
    this.priceTRX.innerHTML = intl.formatNumber(priceTRX,{
      maximumFractionDigits: 6,
    });
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
                // style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px', left: "50%"}}
            >
              <div className="token-sweet-alert">
                <a className="close" onClick={() => {
                  this.setState({alert: null})
                }}><i className="fa fa-times" aria-hidden="true"></i></a>
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
                // style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px', left: "50%"}}
            >
              <div className="mt-5 token-sweet-alert" style={{textAlign:'left'}}>
                <a style={{float: 'right', marginTop: '-45px'}} onClick={() => {
                  this.setState({alert: null})
                }}><i className="fa fa-times" aria-hidden="true"></i></a>
                <h5 style={{color: 'black'}}>{tu('buy_token_info')}</h5>
                {token.remaining === 0 && <span> {tu('no_token_to_buy')}</span>}
                <div className="input-group mt-5">
                  <input
                      type="number"
                      ref={ref => this.buyAmount = ref}
                      className="form-control"
                      max={token.remaining}
                      min={1}
                      onKeyUp={(e)=>{ e.target.value = e.target.value.replace(/^0|[^\d*]/g,'') }}
                      onChange={(e) => {
                        this.onBuyInputChange(e.target.value, ((token.trxNum / token.num)*Math.pow(10, token.precision))/ONE_TRX, token.remaining)
                      }}
                  />
                </div>
                <div className="text-center mt-3 text-muted">
                  <b>= <span ref={ref => this.priceTRX = ref}>0</span> TRX</b>
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
    let price=((token.trxNum / token.num)*Math.pow(10, token.precision));
    let {buyAmount} = this.state;
    if (buyAmount <= 0) {
      return;
    }
    let {currentWallet, wallet} = this.props;
    let tokenCosts = buyAmount * (price / ONE_TRX);

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
                <p className="ml-auto buy_confirm_message">{tu("buy_confirm_message_1")}</p>
                <span>
                {buyAmount} {token.name} {t("for")} {parseFloat((buyAmount * (price / ONE_TRX)).toFixed(6))} TRX?
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
    let price=((token.trxNum / token.num)*Math.pow(10, token.precision));
    let {account, currentWallet} = this.props;
    let {buyAmount} = this.state;
      let res;
      if (Lockr.get("islogin") || this.props.walletType.type==="ACCOUNT_LEDGER" || this.props.walletType.type==="ACCOUNT_TRONLINK") {
        const tronWebLedger = this.props.tronWeb();
        const { tronWeb } = this.props.account;
          try {
            if (this.props.walletType.type === "ACCOUNT_LEDGER") {
              const unSignTransaction = await tronWebLedger.transactionBuilder.purchaseToken(token.ownerAddress, token.id+"", parseInt((buyAmount * price).toFixed(0)), this.props.walletType.address).catch(e => false);
              const {result} = await transactionResultManager(unSignTransaction, tronWebLedger);
              res = result;
            }
            if(this.props.walletType.type === "ACCOUNT_TRONLINK"){
              const unSignTransaction = await tronWeb.transactionBuilder.purchaseToken(token.ownerAddress, token.id+"", parseInt((buyAmount * price).toFixed(0)), tronWeb.defaultAddress.hex).catch(e => false);
              const {result} = await transactionResultManager(unSignTransaction, tronWeb);
              res = result;
            }
          } catch (e) {
              console.log(e)
          }
      }else {
          let isSuccess = await Client.participateAsset(
              currentWallet.address,
              token.ownerAddress,
              token.id+"",
              parseInt((buyAmount * price).toFixed(0)))(account.key);
          res = isSuccess.success
      }


    if (res) {
      this.setState({
        activeToken: null,
        confirmedParticipate: true,
        participateSuccess: res,
        buyAmount: 0,
      });

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
        width: '50%',
        render: (text, record, index) => {
          return <div className="table-imgtext">
            {record.imgUrl ?
                <div style={{width: '42px', height: '42px', marginRight: '18px'}}>
                    {
                        record.id == 1002000? <div className="token-img-top">
                          <img style={{width: '42px', height: '42px'}} src={record.imgUrl}/>
                          <i></i>
                        </div>:<img style={{width: '42px', height: '42px'}} src={record.imgUrl}/>
                    }
                </div> :
                <div style={{width: '42px', height: '42px', marginRight: '18px'}}><img
                    style={{width: '42px', height: '42px'}} src={require('../../../images/logo_default.png')}/></div>
            }

            <div>
              <h5><TokenLink name={record.name} id={record.id}
                             namePlus={record.name + ' (' + record.abbr + ')'} address={record.ownerAddress}/>
              </h5>
              <p style={{wordBreak: "break-all"}}>{record.description}</p>
            </div>
          </div>
        }
      },
      {
        title: intl.formatMessage({id: 'price'})+ ' (TRX)',
        render: (text, record, index) => {
          return <div>{record.priceInTrx}</div>
        },
        align: 'center',
        className: 'ant_table d-none d-md-table-cell _text_nowrap'
      },
      {
        title: intl.formatMessage({id: 'pairs_change'}),
        render: (text, record, index) => {
          return <div className={record.color}>{record.gain}</div>
        },
        align: 'center',
        className: 'ant_table d-none d-md-table-cell _text_nowrap'
      },
      {
        title: intl.formatMessage({id: '24H_VOL'}),
        dataIndex: 'volume24hInTrx',
        key: 'volume24hInTrx',
        align: 'center',
        className: 'ant_table',
        render: (text, record, index) => {
          return text>0? <FormattedNumber value={text} maximumFractionDigits={2}/>: '-'
        }
      },
      {
        title: intl.formatMessage({id: 'market_capitalization'}),
        dataIndex: 'marketcap',
        key: 'marketcap',
        render: (text, record, index) => {
          return text>0? <FormattedNumber value={text}/>: '-'
        },
        align: 'center',
        className: 'ant_table _text_nowrap'
      },
      {
        title: intl.formatMessage({id: 'token_holders'}),
        dataIndex: 'nrOfTokenHolders',
        key: 'nrOfTokenHolders',
        render: (text, record, index) => {
          return text>0? <FormattedNumber value={text}/>: '-'
        },
        align: 'center',
        className: 'ant_table d-none d-sm-table-cell'
      }
    ];
    return column;
  }

  render() {
    let {tokens, alert, loading, total, totalAll} = this.state;
    let {match, intl} = this.props;
    let column = this.customizedColumn();
    let tableInfo = intl.formatMessage({id: 'part_total'}) + ' ' + total + '/' + totalAll + ' ' + intl.formatMessage({id: 'part_pass'})
    return (
        <main className="container header-overlap token_black">
          {alert}
          {loading && <div className="loading-style"><TronLoader/></div>}
          {
            <div className="row">
              <div className="col-md-12 table_pos">
                {total ?<div className="table_pos_info d-none d-md-block" style={{left: 'auto', top: '0px'}}>
                          <div className="d-flex align-items-center mb-1">
                            {tu('token_fliter')}:   
                            <Button className="mx-2" onClick={() => this.onChange({filter: 'trc10'})}>{tu('TRC10_token')}</Button>  
                            <Button onClick={() => this.onChange({filter: 'trc20'})}>{tu('TRC20_token')}</Button>
                          </div>
                          <div>
                            {tableInfo} <span>
                              <QuestionMark placement="top" text="newly_issued_token_by_tronscan" className="token-list-info"></QuestionMark>
                            </span> &nbsp;&nbsp;  
                            <Link to="/exchange/trc10">{t("Trade_on_TRXMarket")}></Link>
                          </div>
                        </div> : ''}
                {/*<SmartTable bordered={true} loading={loading} column={column} data={tokens} total={total}*/}
                            {/*onPageChange={(page, pageSize) => {*/}
                              {/*this.loadPage(page, pageSize)*/}
                            {/*}}/>*/}

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
    walletType: state.app.wallet,
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TokenList));
