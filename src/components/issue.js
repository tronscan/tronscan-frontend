import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {loadAccounts} from "../actions/app";
import {tu} from "../utils/i18n";
import {FormattedNumber, injectIntl} from "react-intl";
import {filter, upperFirst,trim} from "lodash";
import {AddressLink} from "./common/Links";
import {CIRCULATING_SUPPLY, ONE_TRX} from "../constants";
import {TRXPrice} from "./common/Price";
import SmartTable from "./common/SmartTable.js"
import {TronLoader} from "./common/loaders";
import {QuestionMark} from "./common/QuestionMark";
import xhr from "axios/index";
import {Client} from "../services/api";
import {Tooltip,Input} from 'antd'

const { Search } = Input;

class issue extends Component {

    constructor() {
        super();

        this.state = {
            loading: true,
            searchString: "",
            accounts: [],
            total: 0,
            searchCriteria:'',
            exchangeFlag: [
                {name: 'binance', addressList: {
                    Cold: ['TMuA6YqfCeX8EhbfYEg5y7S4DqzSJireY9', 'TWd4WrZ9wn84f5x1hZhL4DHvk738ns5jwb'],
                    Hot: ['TAUN6FwrnwwmaEqYcckffC7wYmbaS6cBiX']}
                }
            ]
        }
    }

    componentDidMount() {
        this.loadAccounts();
    }

    loadAccounts = async (page = 1, pageSize = 20) => {
        const { searchCriteria } = this.state

        this.setState({loading: true});

        let {accounts, total, rangeTotal} = await Client.getAccounts({
            sort: '-balance',
            limit: pageSize,
            start: (page - 1) * pageSize
        })
        let exchangeFlag = await Client.getTagNameList()

        accounts.map((item,index) => {
            item.index = index +1;
            // exchangeFlag.map(coin => {
            //     const typeList = Object.keys(coin.addressList)
            //     typeList.map(type => {
            //         if(coin.addressList[type].length == 1){
            //             if(coin.addressList[type][0] === item.address){
            //                 item.tagName = `${upperFirst(coin.name)}${type !== 'default'? `-${type}`: ''}`
            //             }
            //         }else if(coin.addressList[type].length > 1){
            //             coin.addressList[type].map((address, index) => {
            //                 if(address === item.address){
            //                     item.tagName = `${upperFirst(coin.name)}${type !== 'default'? `-${type} ${index + 1}`: ` ${index + 1}`}`
            //                 }
            //             })
            //         }
            //     })
            // })

        })

        // let {txOverviewStats} = await Client.getTxOverviewStats();


        this.setState({
            loading: false,
            accounts: accounts,
            total: 40,
            rangeTotal:rangeTotal,
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
    onSearchChange = (searchCriteria) => {
        console.log('searchCriteria',searchCriteria)
        this.setState({
            searchCriteria: trim(searchCriteria),
        });
    };
    renderAccounts() {

        let {accounts,searchCriteria} = this.state;

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
        let column = [
            {
                title: '序号',
                dataIndex: 'tagName',
                align: 'left',
                render: (text, record, index) => {
                    return <div>{record.index}</div>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'address'})),
                dataIndex: 'address',
                key: 'address',
                align: 'left',
                className: 'ant_table',
                width: '40%',
                render: (text, record, index) => {
                    return record.accountType == 2 ?
                        <span className="d-flex">
              <Tooltip placement="top" title={intl.formatMessage({id: 'contracts'})}>
                <span><i className="far fa-file mr-1"></i></span>
              </Tooltip>

              <AddressLink address={text} isContract={record.toAddressType == 2}/>
            </span> :
                        <AddressLink address={text}/>
                }
            },

            {
                title: upperFirst(intl.formatMessage({id: '本年度积分'})),
                dataIndex: 'balance',
                key: 'supply',
                align: 'left',
                className: 'ant_table',
                // width: '12%',
                render: (text, record, index) => {
                    return <div><FormattedNumber value={1000}/></div>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: '本季度积分'})),
                dataIndex: 'power',
                key: 'power',
                align: 'center',
                // width: '15%',
                render: (text, record, index) => {
                    return <div><FormattedNumber value={500}/></div>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: '本月度积分'})),
                dataIndex: 'balance',
                key: 'balance111',
                align: 'right',
                className: 'ant_table',
                // width: '15%',
                render: (text, record, index) => {
                    return <div><FormattedNumber value={100}/></div>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: '操作'})),
                dataIndex: 'balance',
                key: 'balance222',
                align: 'right',
                className: 'ant_table',
                // width: '15%',
                render: (text, record, index) => {
                    return <a href="javascript:;">查看积分明细</a>
                }
            }
        ];
        return column;
    }

    render() {

        let {match, intl} = this.props;
        let {total, loading, rangeTotal = 0, accounts, searchCriteria} = this.state;
        let filteredCandidates = accounts.map((v, i) => Object.assign({
            rank: i
        }, v));
        if (searchCriteria !== "") {
            filteredCandidates = filter(accounts, c => {
                console.log(c)
                if (c.address && trim(c.address).indexOf(searchCriteria) !== -1) {
                    return true;
                }
                return false;
            });
        }
        let column = this.customizedColumn();
        let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + rangeTotal + ' ' + intl.formatMessage({id: 'account_unit'}) + '<br/>(' + intl.formatMessage({id: 'table_info_big'}) + ')';
        let tableInfoTip = intl.formatMessage({id: 'table_info_account_tip1'}) + ' ' + rangeTotal + ' ' + intl.formatMessage({id: 'table_info_account_tip2'});
        return (
            <main className="container header-overlap pb-3 token_black">
                {/*<div className="row">*/}
                    {/*<div className="col-md-12">*/}
                        {/*<div className="card h-100 text-center widget-icon accout_unit">*/}
                            {/*/!* <WidgetIcon className="fa fa-users text-secondary"/> *!/*/}
                            {/*<div className="card-body">*/}
                                {/*<h3 className="text-primary">*/}
                                    {/*<FormattedNumber value={rangeTotal}/>*/}
                                {/*</h3>*/}
                                {/*{tu("total_accounts")}*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}

                {/*</div>*/}
                {loading && <div className="loading-style"><TronLoader/></div>}
                <div className="row mt-2">
                    <div className="col-md-12 table_pos">
                        {total ?<div className="table_pos_info d-none d-md-block" style={{left: 'auto'}}>
                            <div>{tu('view_total')} {total} {tu('account_unit')}</div>
                        </div> : ''}
                         <div className="table_pos_search" style={{right: '15px',}}>
                             <Search
                                 placeholder="input search text"
                                 enterButton="Search"
                                 size="large"
                                 onSearch={value => this.onSearchChange(value)}
                             />
                         </div>
                        <SmartTable bordered={true} loading={loading} column={column} data={filteredCandidates} total={total} position='bottom' addr
                                    onPageChange={(page, pageSize) => {
                                        this.loadAccounts(page, pageSize)
                                    }}/>
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


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(issue))
