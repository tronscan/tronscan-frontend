import {connect} from "react-redux";
import { Link } from 'react-router-dom';
import React, { Fragment } from "react";
import {tu, t,option_t} from "../../utils/i18n";
import {alpha} from "../../utils/str";
import {Client} from "../../services/api";
import {upperFirst} from "lodash";
import { Tag,Radio } from 'antd';
import {TokenLink, TokenTRC20Link, HrefLink, AddressLink} from "../common/Links";
import {QuestionMark} from "../common/QuestionMark";
import xhr from "axios/index";
import {FormattedDate, FormattedNumber, FormattedRelative, FormattedTime, injectIntl} from "react-intl";
import { API_URL, CONTRACT_MAINNET_API_URL, TOKENTYPE, MARKET_API_URL, VERIFYSTATUS, MARKET_HTTP_URL } from "../../constants";
import { getTime } from "date-fns";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {Tooltip} from "reactstrap";
import { Popover, Button, Tooltip as AntdTip } from 'antd';
import { IS_SUNNET, IS_MAINNET } from './../../constants';
import SweetAlert from 'react-bootstrap-sweetalert';
import SmartTable from "../common/SmartTable.js"
import {ContractTypes} from "../../utils/protocol";

class MySignature extends React.Component{
    constructor() {
        super();
        this.state = {
            modal: null,
            filter: {
                direction:'all'
            },

        };
    }

    onRadioChange = (e) => {
        this.setState({
            filter: {
                direction: e.target.value,
            }
        }, () =>  this.load())
    };

    customizedColumn = () => {
        let {intl, isinternal = false} = this.props;
        let column = [
            {
                title: upperFirst(intl.formatMessage({id: 'signature_type'})),
                dataIndex: 'hash',
                key: 'hash',
                align: 'left',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <span>{ContractTypes[text]}</span>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'signature_sponsor'})),
                dataIndex: 'timestamp',
                key: 'timestamp',
                align: 'left',
                className: 'ant_table',
                width: '14%',
                render: (text, record, index) => {
                    return <span></span>
                    // <TimeAgo date={text} title={moment(text).format("MMM-DD-YYYY HH:mm:ss A")}/>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'signature_time_left'})),
                dataIndex: 'contractType',
                key: 'contractType',
                align: 'right',
                width: '20%',
                className: 'ant_table _text_nowrap',
                render: (text, record, index) => {
                    return <span></span>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'signature_list'})),
                dataIndex: 'confirmed',
                key: 'confirmed',
                align: 'center',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <span></span>
                },
            },
            {
                title: upperFirst(intl.formatMessage({id: 'signature_operate'})),
                dataIndex: 'confirmed',
                key: 'confirmed',
                align: 'center',
                className: 'ant_table',
                render: (text, record, index) => {
                    return  <span></span>
                },
            },
            {
                title: upperFirst(intl.formatMessage({id: 'signature_status'})),
                dataIndex: 'confirmed',
                key: 'confirmed',
                align: 'center',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <span></span>
                },
            },
        ];
        return column;
    }

    render() {
       let {transfers, filter, total, rangeTotal = 0, loading, emptyState: EmptyState = null} = this.state;
       let column = this.customizedColumn();
       return (
           <Fragment>
               <div className="row mt-3">
                   <div className="col-md-12">
                       <div className="card">
                           <div className="card-body">
                               <h5 className="card-title text-center">
                                   {tu("我的签名")}
                               </h5>
                               {
                                    <div className="d-flex align-items-center">
                                       <div className="">
                                           <Radio.Group size="Small" value={filter.direction}  onChange={this.onRadioChange}>
                                               <Radio.Button value="all">{tu('address_transfer_all')}</Radio.Button>
                                               <Radio.Button value="in">{tu('to_be_sign')}</Radio.Button>
                                               <Radio.Button value="out">{tu('signed')}</Radio.Button>
                                               <Radio.Button value="out">{tu('signature_failed')}</Radio.Button>
                                               <Radio.Button value="out">{tu('signature_successful')}</Radio.Button>
                                           </Radio.Group>
                                       </div>
                                   </div>
                               }
                               <div className="token_black table_pos">
                                    {/*<TotalInfo total={total}  rangeTotal={rangeTotal} typeText="transactions_unit" common={!address} top={(!contract)? '-28px': '10px'} selected/>*/}
                                   {/*
                                        (!loading && transactions.length === 0)?
                                           <div className="p-3 text-center no-data">{tu("no_transactions")}</div>:
                                           <SmartTable bordered={true} loading={loading} column={column} data={} total={20}
                                                       onPageChange={(page, pageSize) => {
                                                           this.loadTransactions(page, pageSize)
                                                       }}/>
                                  */ }

                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </Fragment>
       )
    }
}

function mapStateToProps(state) {
    return {
        account: state.app.account,
        wallet: state.wallet,
        walletType: state.app.wallet,
        currentWallet: state.wallet.current,
        activeLanguage: state.app.activeLanguage,
        sidechains: state.app.sideChains,
    };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(MySignature))

