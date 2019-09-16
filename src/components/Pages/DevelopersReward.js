import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {loadAccounts} from "../../actions/app";
import {tu} from "../../utils/i18n";
import {FormattedNumber, injectIntl} from "react-intl";
import {filter, upperFirst,trim} from "lodash";
import {AddressLink} from "../common/Links";
import {CIRCULATING_SUPPLY, ONE_TRX} from "../../constants";
import {TRXPrice} from "../common/Price";
import SmartTable from "../common/SmartTable.js"
import {TronLoader} from "../common/loaders";
import {QuestionMark} from "../common/QuestionMark";
import xhr from "axios/index";
import {Client} from "../../services/api";
import {Tooltip,Input} from 'antd'
import Note from "./Note";
import {NameWithId} from "../common/names";
const { Search } = Input;

class developersReward extends Component {

    constructor() {
        super();

        this.state = {
            modal: null,
            loading: true,
            searchString: "",
            developers: [],
            total: 0,
            searchCriteria:"",
        }
    }

    componentDidMount() {
        this.loadAccounts();
    }

    loadAccounts = async (page = 1, pageSize = 20) => {
        const { searchCriteria } = this.state

        this.setState({loading: true});

        let {data, total} = await Client.getUserList({
            "search": searchCriteria,
            "userSort": "",
            'pageSize': pageSize,
            'page':1
        })

        data.map((item,index) => {
            item.index = index +1;

        })

        this.setState({
            loading: false,
            developers: data,
            total: total,
        });
    };

    componentDidUpdate() {

    }
    hideModal = () => {
        this.setState({
            modal: null,
        });
    };

    showNote = (index) => {
        console.log('this.state.developers[index].note',this.state.developers[index].note)
        let notes = (new Function("return " + this.state.developers[index].note))();;
        this.setState({
            modal: (
                <Note
                    notes={notes}
                    onHide={this.hideModal}
                />
            )
        });
    };
    onChange = (page, pageSize) => {
        this.loadAccounts(page, pageSize);
    };

    onSearchChange = (searchCriteria) => {
        this.setState({
            searchCriteria: trim(searchCriteria),
        },()=>{
            this.loadAccounts();
        });
    };


    renderAccounts() {
        let {developers} = this.state;
        if (developers.length === 0) {
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
                            developers.map((account, index) => (
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
                title: upperFirst(intl.formatMessage({id: '用户名'})),
                dataIndex: 'address',
                key: 'address',
                align: 'left',
                className: 'ant_table',
                width: '40%',
                render: (text, record, index) => {
                    return <div>{record.name}{`(${record.email})`}</div>
                }
            },

            {
                title: upperFirst(intl.formatMessage({id: '本年度积分'})),
                dataIndex: 'balance',
                key: 'supply',
                align: 'center',
                className: 'ant_table',
                // width: '12%',
                render: (text, record, index) => {
                    return <div><FormattedNumber value={record.currentYear}/></div>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: '本季度积分'})),
                dataIndex: 'power',
                key: 'power',
                align: 'center',
                // width: '15%',
                render: (text, record, index) => {
                    return <div><FormattedNumber value={record.currentQuarter}/></div>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: '本月度积分'})),
                dataIndex: 'balance',
                key: 'balance111',
                align: 'center',
                className: 'ant_table',
                // width: '15%',
                render: (text, record, index) => {
                    return <div><FormattedNumber value={record.currentMonth}/></div>
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
                    console.log('record',record)
                    console.log('index',index)
                    return <a href="javascript:;" onClick={() => {
                        this.showNote(index)
                    }}>查看积分明细</a>
                }
            }
        ];
        return column;
    }

    render() {

        let {match, intl} = this.props;
        let {total, loading, rangeTotal = 0, developers,modal} = this.state;

        let column = this.customizedColumn();
        let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + rangeTotal + ' ' + intl.formatMessage({id: 'account_unit'}) + '<br/>(' + intl.formatMessage({id: 'table_info_big'}) + ')';
        let tableInfoTip = intl.formatMessage({id: 'table_info_account_tip1'}) + ' ' + rangeTotal + ' ' + intl.formatMessage({id: 'table_info_account_tip2'});
        return (
            <main className="container header-overlap pb-3 token_black">
                {modal}
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
                        <SmartTable bordered={true} loading={loading} column={column} data={developers} total={total} position='bottom' addr
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


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(developersReward))
