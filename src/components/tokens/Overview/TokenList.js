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


class TokenList extends Component {

  constructor(props) {
    super(props);


    this.state = {
      tokens: [],
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
  preBuyTokens = (token) => {
    let {buyAmount} = this.state;
    let {currentWallet, wallet} = this.props;

    if (!wallet.isOpen) {
      this.setState({
        alert: (
            <SweetAlert
                warning
                title="Open wallet"
                onConfirm={() => this.setState({alert: null})}>
              Open a wallet to participate
            </SweetAlert>
        ),
      });
      return;
    }
    else {
      this.setState({
        alert: (
            <SweetAlert
                info
                onConfirm={() => {
                  this.buyTokens(token)
                }}>
              你想要购买多少数量的通证？
              <div className="input-group">
                <input
                    className="form-control"
                    value={buyAmount}
                    max={token.remaining}
                    min={1}
                    onChange={value => this.setState({buyAmount: value})}
                />
              </div>
            </SweetAlert>
        ),
      });
    }
  }
  buyTokens = (token) => {


    let tokenCosts = buyAmount * (token.price / ONE_TRX);

    if ((currentWallet.balance / ONE_TRX) < tokenCosts) {
      this.setState({
        alert: (
            <SweetAlert
                warning
                title={tu("insufficient_trx")}
                onConfirm={() => this.setState({alert: null})}
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
                onCancel={() => this.setState({alert: null})}
            >
              {tu("buy_confirm_message_1")}<br/>
              {buyAmount} {token.name} {t("for")} {buyAmount * (token.price / ONE_TRX)} TRX?
            </SweetAlert>
        ),
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

      },
      {
        title: intl.formatMessage({id: 'token'}),
        dataIndex: 'name',
        key: 'name',
        width: '50%',
        render: (text, record, index) => {
          // console.log(record);
          return <div><h5>{record.name}{'('}{record.abbr}{')'}</h5><p>{record.description}</p></div>
        }
      },
      {
        title: '信用评级',
        dataIndex: 'credit',
        key: 'credit',
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
        }
      },
      {
        title: '发行时间',
        dataIndex: 'dateCreated',
        key: 'dateCreated',
        render: (text, record, index) => {
          return <FormattedDate value={text}/>
        }
      },
      {
        title: '参与发行',
        render: (text, record, index) => {
          if (record.endTime < new Date() || record.issuedPercentage === 100)
            return <button className="btn btn-secondary btn-block">{tu("finish")}</button>
          else
            return <button className="btn btn-danger btn-block"
                           onClick={() => this.buyTokens(record)}>{tu("participate")}</button>
        }
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
  };
}

const mapDispatchToProps = {
  loadTokens,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TokenList));
