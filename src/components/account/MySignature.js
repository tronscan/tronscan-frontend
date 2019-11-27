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
import TotalInfo from "../common/TableTotal";
import Countdown from "react-countdown-now";
import {ContractTypes} from "../../utils/protocol";

class MySignature extends React.Component{
    constructor() {
        super();
        this.state = {
            modal: null,
            total:0,
            data:[],
            //0-签名中，1-签名交易完成， 2-交易过期/处理失败
            filter: {
                direction:0
            },
        };
    }

    componentDidMount() {
        this.load()
    }


    load = async (page = 1, pageSize = 20) => {
        let { wallet } = this.props;
        console.log('wallet',wallet)
        console.log('wallet222',wallet.address)
        let { filter } = this.state;
        let { data:{data} } = await xhr.get("https://testlist.tronlink.org/api/wallet/multi/trx_record", {params: {
            "address": wallet.address,
            "start": (page - 1) * pageSize,
            "state": filter.direction,
            "limit": pageSize,
            "netType":"shasta"
        }});
        let signatureList = data.data;
        let total = data.total;
        console.log('signatureList',signatureList)
        console.log('total',total)

        this.setState({
            page,
            data:signatureList,
            total:total,
            loading: false,
        });
    };

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
                dataIndex: 'contractType',
                key: 'contractType',
                align: 'left',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <span>{text}</span>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'signature_sponsor'})),
                dataIndex: 'originatorAddress',
                key: 'originatorAddress',
                align: 'left',
                className: 'ant_table',
                width: '14%',
                render: (text, record, index) => {
                    return <AddressLink address={text}>{text}</AddressLink>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'signature_time_left'})),
                dataIndex: 'expireTime',
                key: 'expireTime',
                align: 'center',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <Countdown date={Date.now() + text*1000} daysInHours={true}/>
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
       let {data, filter, total, rangeTotal = 0, loading, emptyState: EmptyState = null} = this.state;
       console.log('data',data)
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
                                   <TotalInfo total={total}  typeText="transactions_unit"/>
                                   {
                                       (!loading && data.length === 0 )?
                                           <div className="p-3 text-center no-data">{tu("no_transactions")}</div>:
                                           <SmartTable bordered={true} loading={loading} column={column} data={data} total={20}
                                                       onPageChange={(page, pageSize) => {
                                                           this.load(page, pageSize)
                                                       }}/>
                                   }



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
        wallet: state.wallet.current,
        walletType: state.app.wallet,
        currentWallet: state.wallet.current,
        activeLanguage: state.app.activeLanguage,
        sidechains: state.app.sideChains,
    };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(MySignature))

