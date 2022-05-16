import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {loadAccounts} from "../actions/app";
import {tu} from "../utils/i18n";
import {FormattedNumber, injectIntl} from "react-intl";
import {filter, upperFirst} from "lodash";
import {AddressLink} from "./common/Links";
import {CIRCULATING_SUPPLY, ONE_TRX, ADDRESS_TAG_ICON} from "../constants";
import {TRXPrice} from "./common/Price";
import SmartTable from "./common/SmartTable.js"
import {TronLoader} from "./common/loaders";
import {QuestionMark} from "./common/QuestionMark";
import xhr from "axios/index";
import {Client, AccountApi} from "../services/api";
import {Tooltip, Table,Icon} from 'antd'
import { Link } from "react-router-dom";

function setTagIcon(tag){
  if(!tag) return
  let name = ''
  ADDRESS_TAG_ICON.map(v => {
    if(tag.indexOf(v) > -1){
      name = v
    }
  })
  return name && <img src={require(`../images/address/tag/${name}.svg`)}/>
}

class Accounts extends Component {

  constructor() {
    super();

    this.state = {
      loading: true,
      searchString: "",
      accounts: [],
      total: 0,
      exchangeFlag: [
        {name: 'binance', addressList: {
          Cold: ['TMuA6YqfCeX8EhbfYEg5y7S4DqzSJireY9', 'TWd4WrZ9wn84f5x1hZhL4DHvk738ns5jwb'],
          Hot: ['TAUN6FwrnwwmaEqYcckffC7wYmbaS6cBiX']}
        }
      ],
      pagination: {
        showQuickJumper: true,
        position: "bottom",
        showSizeChanger: true,
        defaultPageSize: 20,
        total: 0
      },
      newAddressSeen: 0,
      sort: '-balance',
      sortColumn: {
        order: 'descend',
        columnKey: 'balance'
      }
    }
  }

  componentDidMount() {
    this.loadAccounts();
  }

  loadAccounts = async (page = 1, pageSize = 20) => {
    const { sort } = this.state

    this.setState({loading: true});


 
    let {accounts, total, rangeTotal,contractMap} = await Client.getAccounts({
      sort: sort,
      limit: pageSize,
      start: (page - 1) * pageSize
    }).catch(e => console.log(e))
    accounts.forEach(item=>{
      if(contractMap){
          contractMap[item.address]? (item.ownerIsContract = true) :  (item.ownerIsContract = false)
      }
    })
    let { data } = await AccountApi.getAccountOverviewStats({
      days: 1
    }).catch(e => console.log(e))

    // let exchangeFlag = await Client.getTagNameList()
    //
    // accounts.map(item => {
    //   item.tagName = ''
    //   exchangeFlag.map(coin => {
    //     const typeList = Object.keys(coin.addressList)
    //     typeList.map(type => {
    //       if(coin.addressList[type].length == 1){
    //         if(coin.addressList[type][0] === item.address){
    //           item.tagName = `${upperFirst(coin.name)}${type !== 'default'? `-${type}`: ''}`
    //         }
    //       }else if(coin.addressList[type].length > 1){
    //         coin.addressList[type].map((address, index) => {
    //           if(address === item.address){
    //             item.tagName = `${upperFirst(coin.name)}${type !== 'default'? `-${type} ${index + 1}`: ` ${index + 1}`}`
    //           }
    //         })
    //       }
    //     })
    //   })
    //  })


     // let {txOverviewStats} = await Client.getTxOverviewStats();
    let count = 0;
    accounts.map((item,index) => {
      item.index = count + 1 + (page-1)*pageSize
      count++
    })
    this.setState({
      loading: false,
      accounts: accounts,
      total: total,
      rangeTotal:rangeTotal,
      newAddressSeen: data && data[0] && data[0].newAddressSeen,
      pagination: {
        ...this.state.pagination,
        total
      }
    });
  };

  componentDidUpdate() {
    //checkPageChanged(this, this.loadAccounts);
  }

  onChange = (page, pageSize) => {
    this.loadAccounts(page, pageSize);
  };
  onSearchFieldChangeHandler = (e) => {
    this.setState({
      searchString: e.target.value,
    });
  };

  filteredAccounts() {
    let {accounts} = this.props;
    let {searchString} = this.state;

    searchString = searchString.toUpperCase();

    if (searchString.length > 0) {
      accounts = filter(accounts, a => a.address.toUpperCase().indexOf(searchString) !== -1);
    }

    return accounts;
  }

  renderAccounts() {

    let {accounts} = this.state;

    if (accounts.length === 0) {
      return;
    }

    return (
        <Fragment>
          <div className="table-responsive">
            <table className="table table-striped m-0">
              <thead className="thead-dark">
              <tr>
                <th>{tu("address")}</th>
                <th className="d-md-table-cell">{tu("supply")}</th>
                <th className="d-md-table-cell">{tu("power")}</th>
                <th>{tu("balance")}</th>
              </tr>
              </thead>
              <tbody>
              {
                accounts.map((account, index) => (
                    <tr key={account.address}>
                      <th>
                        <AddressLink address={account.address}/>
                      </th>
                      <td className="d-md-table-cell text-nowrap">
                        <FormattedNumber
                            value={(((account.balance / ONE_TRX) / CIRCULATING_SUPPLY) * 100)}
                            minimumFractionDigits={8}
                            maximumFractionDigits={8}
                        /> %
                      </td>
                      <td className="text-nowrap d-md-table-cell">
                        <FormattedNumber value={account.power / ONE_TRX}/>
                      </td>
                      <td className="text-nowrap">
                        <TRXPrice amount={account.balance / ONE_TRX}/>
                      </td>
                    </tr>
                ))
              }
              </tbody>
            </table>
          </div>

        </Fragment>
    )
  }

  customizedColumn = () => {
    let {intl} = this.props;
    let {sortColumn} = this.state;
    let column = [
      {
        title: upperFirst(intl.formatMessage({id: 'account_rank'})),
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        width: '8%',
        render: (text, record, index) => {
            return text
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'accounts'})),
        dataIndex: 'address',
        key: 'address',
        align: 'left',
        className: 'ant_table',
        width: '35%',
        render: (text, record, index) => {
          return (
                <div className="d-flex">
                  <div style={{width: '240px'}}>
                    {/*  Distinguish between contract and ordinary address */}
                    {record.ownerIsContract? (
                      <span className="d-flex"> 
                        <Tooltip
                          placement="top"
                          title={upperFirst(
                              intl.formatMessage({
                              id: "transfersDetailContractAddress"
                              })
                          )}
                          >
                          <Icon
                              type="file-text"
                              style={{
                              verticalAlign: 0,
                              color: "#77838f",
                              lineHeight: 1.4
                              }}
                          />
                          </Tooltip>
                          <AddressLink address={text} isContract={true}>{text}</AddressLink>
                      </span>
                    ) :
                      <AddressLink address={text}>{text}</AddressLink>
                    }
                  </div>
                  <div style={{marginLeft: '10px'}}>
                    <span style={{whiteSpace:'nowrap'}}> 
                    {record.addressTag?(
                      <span className="address-tag">
                        {setTagIcon(record.addressTag)}
                        <span>{record.addressTag}</span>
                      </span>
                      ):''
                    } </span>
                  </div>
                </div>
                )
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'account_balance'})),
        dataIndex: 'balance',
        key: 'balance',
        sorter: true,
        defaultSortOrder: "descend",
        sortOrder: sortColumn.columnKey == 'balance' && sortColumn.order,
        sortDirections: ["descend", "ascend"],
        align: 'left',
        className: 'ant_table',
        // width: '10%',
        render: (text, record, index) => {
          return <TRXPrice amount={parseInt(text) / ONE_TRX}/>
        }
      },
      {
        // title: upperFirst(intl.formatMessage({id: 'account_percent'})),
        title: (
          <div>
            {upperFirst(intl.formatMessage({ id: "account_percent" }))}
            <span className="ml-2">
              <QuestionMark placement="top" text="account_percent_tip" />
            </span>
          </div>
        ),
        dataIndex: 'balance',
        key: 'supply',
        sorter: true,
        sortOrder: sortColumn.columnKey == 'supply' && sortColumn.order,
        sortDirections: ["descend", "ascend"],
        align: 'left',
        className: 'ant_table',
        width: '12%',
        render: (text, record, index) => {
          return <div><FormattedNumber
              value={(((parseInt(text) / ONE_TRX) / CIRCULATING_SUPPLY) * 100)}
              minimumFractionDigits={8}
              maximumFractionDigits={8}
          /> %</div>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'account_power'})),
        dataIndex: 'power',
        key: 'power',
        sorter: true,
        sortOrder: sortColumn.columnKey == 'power' && sortColumn.order,
        sortDirections: ["descend", "ascend"],
        align: 'left',
        // width: '15%',
        render: (text, record, index) => {
          return (
            <span>
              {text ? <FormattedNumber value={parseInt(text) / ONE_TRX} /> : (text == 0 ? 0 : '-')}
            </span>
          );
        }
      },
      {
        title: (
          <div>
            {upperFirst(intl.formatMessage({ id: "account_trade_count" }))}
            <span className="ml-2">
              <QuestionMark placement="top" text="account_trade_count_tip" />
            </span>
          </div>
        ),
        dataIndex: 'totalTransactionCount',
        key: 'totalTransactionCount',
        sorter: true,
        sortOrder: sortColumn.columnKey == 'totalTransactionCount' && sortColumn.order,
        sortDirections: ["descend", "ascend"],
        align: 'left',
        render: (text, record, index) => {
            return (<span>
              {record.totalTransactionCount ? <FormattedNumber value={record.totalTransactionCount} /> : (record.totalTransactionCount == 0 ? 0 : '-')}
            </span>)
        }
      }
    ];
    return column;
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    if(sorter.order === undefined){
      sorter['order']= 'descend'
    }
    this.setState(
      {
        pagination: pager,
        sort: `${sorter.order === "descend" ? "-" : ""}${
          sorter.order ? sorter.field : ""
        }`,
        sortColumn: {
          order: sorter.order,
          columnKey: sorter.columnKey
        }
      },
      () => this.loadAccounts(pager.current, pager.pageSize)
    );
  };

  render() {

    let {match, intl} = this.props;
    let {total, loading, rangeTotal = 0, newAddressSeen, accounts, pagination} = this.state;
    let column = this.customizedColumn();
    let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + rangeTotal + ' ' + intl.formatMessage({id: 'account_unit'}) + '<br/>(' + intl.formatMessage({id: 'table_info_big'}) + ')';
    let tableInfoTip = intl.formatMessage({id: 'view_total'}) + ' ' + rangeTotal + ' ' + intl.formatMessage({id: 'table_info_account_tip2'});
      return (
        <main className="container header-overlap pb-3 token_black account_main">
          <div className="row">
            <div className="d-flex col-md-12 justify-content-end my-2">
              <Link to="/data/stats#address">{tu('account_more')}></Link>
            </div>
            <div className="d-flex col-md-12 panel">
              <div className="card h-100 widget-icon accout_unit">
                {/* <WidgetIcon className="fa fa-users text-secondary"/> */}
                <div className="card-body">
                  <h3 className="text-primary">
                    {newAddressSeen ? <FormattedNumber value={newAddressSeen}/> : '-'}
                  </h3>
                  {tu("account_lastDay_count")}
                </div>
              </div>
              <div className="card h-100 widget-icon accout_total">
                {/* <WidgetIcon className="fa fa-users text-secondary"/> */}
                <div className="card-body">
                  <h3 className="text-primary">
                  {rangeTotal ? <FormattedNumber value={rangeTotal}/> : '-'}
                  </h3>
                  {tu("account_realTime_count")}
                </div>
              </div>
            </div>

          </div>
          {loading && <div className="loading-style"><TronLoader/></div>}
          <div className="row mt-2">
            <div className="col-md-12 table_pos">
              {total ?<div className="d-none d-md-block mt-2 mb-2"  style={{color: '#999',fontSize: '16px'}}>
                      <div>
                        {tu('account_total_tip')}
                        {/* {tu('view_total')} {rangeTotal} {tu('account_unit')}  */}
                        {/* <QuestionMark placement="top" info={tableInfoTip} ></QuestionMark> */}
                          {/* <br/> */}
                          {/* {rangeTotal>10000? <span>({tu('table_info_big1')}10000{tu('table_info_big2')})</span>:''} */}
                      </div>
              </div> : ''}
              {/* <SmartTable bordered={true} loading={loading} column={column} data={accounts} total={total} position="bottom"
                          onPageChange={(page, pageSize) => {
                            this.loadAccounts(page, pageSize)
                          }}/> */}

              <Table
                bordered={true}
                columns={column}
                rowKey={(record, index) => {
                  return index;
                }}
                dataSource={accounts}
                scroll={scroll}
                pagination={pagination}
                loading={loading}
                onChange={this.handleTableChange}
              />
            </div>
          </div>
        </main>
    )
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.app.accounts,
  };
}

const mapDispatchToProps = {
  loadAccounts,
};


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Accounts))
