import React, {Component} from 'react';
import {connect} from "react-redux";
import {loadTokens} from "../../../actions/tokens";
import {FormattedDate, FormattedNumber, FormattedTime, injectIntl} from "react-intl";
import SweetAlert from "react-bootstrap-sweetalert";
import {t, tu} from "../../../utils/i18n";
import {trim} from "lodash";
import {Sticky, StickyContainer} from "react-sticky";
import {Client} from "../../../services/api";
import Paging from "../../common/Paging";
import {TokenLink} from "../../common/Links";
import {getQueryParam} from "../../../utils/url";
import SearchInput from "../../../utils/SearchInput";
import {toastr} from 'react-redux-toastr'
import SmartTable from "../../common/SmartTable.js"
import {ONE_TRX} from "../../../constants";
import {login} from "../../../actions/app";
import {reloadWallet} from "../../../actions/wallet";


class TokenList extends Component {

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
      this.state.filter.name = `%${nameQuery}%`;
    }
  }

  loadPage = async (page = 1, pageSize = 40) => {
    let {filter} = this.state;
    let {intl} = this.props;
    this.setState({loading: true});

    let {tokens, total} = await Client.getTokens({
      sort: '-name',
      limit: pageSize,
      start: (page - 1) * pageSize,
      ...filter,
    });

    if (tokens.length === 0) {
      toastr.warning(intl.formatMessage({id: 'warning'}), intl.formatMessage({id: 'record_not_found'}));
    }
    for (let index in tokens) {
      tokens[index].index = parseInt(index) + 1;
    }

    function compare(property) {
      return function (obj1, obj2) {

        if (obj1[property] > obj2[property]) {
          return -1;
        } else if (obj1[property] < obj2[property]) {
          return 1;
        } else {
          return 0;
        }

      }
    }

    //tokens = tokens.sort(compare('issuedPercentage'));
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
          name: `%${nameQuery}%`,
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
          name: `%${name}%`,
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
    this.setState({buyAmount: value});
    this.buyAmount.value = value;
    let priceTRX = value * (price / ONE_TRX);
    this.priceTRX.innerHTML = intl.formatNumber(priceTRX);
  }
  preBuyTokens = (token) => {
    let {buyAmount} = this.state;
    let {currentWallet, wallet} = this.props;

    if (!wallet.isOpen) {
      this.setState({
        alert: (
            <SweetAlert
                info
                title="Open wallet"
                showConfirm={false}
                style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
            >
              <div className="" style={{width: '390px', margin: 'auto'}}>
                <a style={{float: 'right', marginTop: '-165px'}} onClick={() => {
                  this.setState({alert: null})
                }}>X</a>
                <span>Open a wallet to participate</span>
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
              <div className="mt-5" style={{width: '390px', margin: 'auto'}}>
                <a style={{float: 'right', marginTop: '-45px'}} onClick={() => {
                  this.setState({alert: null})
                }}>X</a>
                <h5 style={{color: 'black'}}>你想要购买多少数量的通证？</h5>
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
                  <b>= <span ref={ref => this.priceTRX = ref}></span> TRX</b>
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
              <div className="mt-5" style={{width: '390px', margin: 'auto'}}>
                <a style={{float: 'right', marginTop: '-155px'}} onClick={() => {
                  this.setState({alert: null})
                }}>X</a>
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
              <div className="mt-5" style={{width: '390px', margin: 'auto'}}>
                <a style={{float: 'right', marginTop: '-155px'}} onClick={() => {
                  this.setState({alert: null})
                }}>X</a>
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
  confirmTransaction = async (token) => {
    let {account} = this.props;
    let {buyAmount} = this.state;

    let isSuccess = await Client.participateAsset(
        account.address,
        token.ownerAddress,
        token.name,
        buyAmount * token.price)(account.key);

    this.setState({
      alert: (
          <SweetAlert
              success
              showConfirm={false}
              style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
          >
            <div className="mt-5" style={{width: '390px', margin: 'auto'}}>
              <a style={{float: 'right', marginTop: '-155px'}} onClick={() => {
                this.setState({alert: null})
              }}>X</a>
              <h5 style={{color: 'black'}}>{tu('transaction')} {tu('confirm')}</h5>
              <span>
               Successfully received {token.name} tokens
              </span>
              <button className="btn btn-danger btn-block mt-3" onClick={() => {
                this.setState({alert: null})
              }}>{tu("OK")}</button>
            </div>

          </SweetAlert>
      )
    });

  };

  customizedColumn = () => {
    let {intl} = this.props;
    let column = [
      {
        title: '#',
        dataIndex: 'index',
        key: 'index',
        className: 'ant_table',
      },
      {
        title: intl.formatMessage({id: 'token'}),
        dataIndex: 'name',
        key: 'name',
        width: '50%',
        render: (text, record, index) => {
          // console.log(record);
          return <div style={{paddingTop: '10px'}}><h5>{record.name}{'('}{record.abbr}{')'}</h5>
            <p>{record.description}</p></div>
        }
      },
      {
        title: '信用评级',
        dataIndex: 'credit',
        key: 'credit',
        className: 'ant_table'
      },
      {
        title: '发行进度',
        dataIndex: 'issuedPercentage',
        key: 'issuedPercentage',
        render: (text, record, index) => {
          //  console.log(text);
          if (text === null)
            text = 0;
          return <div><FormattedNumber value={text}/>%</div>
        },
        className: 'ant_table'
      },
      {
        title: '发行时间',
        dataIndex: 'dateCreated',
        key: 'dateCreated',
        render: (text, record, index) => {
          return <FormattedDate value={text}/>
        },
        className: 'ant_table'
      },
      {
        title: '参与发行',
        render: (text, record, index) => {
          if (record.endTime < new Date() || record.issuedPercentage === 100)
            return <button className="btn btn-secondary btn-block">{tu("finish")}</button>
          else
            return <button className="btn btn-danger btn-block"
                           onClick={() => this.preBuyTokens(record)}>{tu("participate")}</button>
        },
        className: 'ant_table'
      }
    ];

    return column;
  }


  render() {

    let {tokens, alert, loading, total} = this.state;
    let {match} = this.props;
    let column = this.customizedColumn();
    return (
        <main className="container header-overlap">
          {alert}
          {
            <div className="row">
              <div className="col-md-12">
                <span style={{
                  marginTop: '25px',
                  marginLeft: '5px',
                  position: 'absolute',
                  zIndex: '1000'
                }}>当前共{total}个通证</span>
                <SmartTable loading={loading} column={column} data={tokens} total={total}
                            onPageChange={(page, pageSize) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TokenList));
