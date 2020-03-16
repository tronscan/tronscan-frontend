import React, {Fragment} from "react";
import {FormattedDate, FormattedNumber, FormattedTime, injectIntl} from "react-intl";
import {Sticky, StickyContainer} from "react-sticky";
import Paging from "./Paging";
import {connect} from "react-redux";
import {Client} from "../../services/api";
import {TransactionHashLink, AddressLink, BlockNumberLink} from "./Links";
import {tu} from "../../utils/i18n";
import { Icon,Checkbox } from "antd";
// import TimeAgo from "react-timeago";
import {TronLoader} from "./loaders";
import {Truncate,TruncateAddress} from "./text";
import {ContractTypes} from "../../utils/protocol";
import SmartTable from "./SmartTable.js"
import {upperFirst} from "lodash";
import {QuestionMark} from "./QuestionMark";
import TotalInfo from "./../../components/addresses/components/TableTotal";
import DateSelect from './../../components/addresses/components/dateSelect'
import moment from 'moment';
import {NameWithId} from "./names";
import isMobile from "../../utils/isMobile";
import rebuildList from "../../utils/rebuildList";
import xhr from "axios/index";
import {API_URL} from '../../constants.js'
import qs from 'qs'
import BlockTime from '../common/blockTime'


const CheckboxGroup = Checkbox.Group;

class NewTransactions extends React.Component {

    constructor(props) {
        super(props);
        let intl = props.intl;
        this.start = moment([2018,5,25]).startOf('day').valueOf();
        this.end = moment().valueOf();
        this.state = {
            filter: {},
            transactions: [],
            total: 0,
            emptyState: props.EmptyState || (
                <TronLoader>
                    Loading Transactions
                </TronLoader>
            ),
            timeType: true,
            filterTitleKey:'',
            typeFilter:{
                checkedList:[],
                indeterminate:'',
                checkAll:false,
            },
            statusFilter:{
                checkedList:[],
                indeterminate:'',
                checkAll:false,
            },
            resultFilter:{
                checkedList:[],
                indeterminate:'',
                checkAll:false,
            },
            tokenFilter:{
                checkedList:[],
                indeterminate:'',
                checkAll:false,
            },
            typeOptionsAry:[
                { label: upperFirst(intl.formatMessage({id: 'address_account_table_filter_transfers'})), value: 1 },
                { label: upperFirst(intl.formatMessage({id: 'address_account_table_filter_freeze'})), value: 2 },
                { label: upperFirst(intl.formatMessage({id: 'address_account_table_filter_unfreeze'})), value: 3 },
                { label: upperFirst(intl.formatMessage({id: 'address_account_table_filter_trigger_smartContracts'})), value: 4 },
                { label: upperFirst(intl.formatMessage({id: 'address_account_table_filter_vote'})), value: 5 },
                { label: upperFirst(intl.formatMessage({id: 'address_account_table_filter_other'})), value: 6 },
            ],
            statusOptionsAry: [
                { label:  upperFirst(intl.formatMessage({id: 'full_node_version_unconfirmed'})), value: 1 },
                { label:  upperFirst(intl.formatMessage({id: 'full_node_version_confirmed'})), value: 2 },
                // { text:  upperFirst(intl.formatMessage({id: 'block_detail_rolled_back'})), value: '3' },
            ],
            resultOptionsAry: [
                { label:  'SUCCESS', value: 1 },
                { label:  'FAIL', value: 2 },
            ],
            tokenOptionsAry: [
                { label:  '后端获取', value: 1 },
                { label:  '后端获取', value: 2 },
            ]
        };
        
    }

    componentDidMount() {
        // this.loadTransactions();
    }

    componentDidUpdate(prevProps) {
        let {filter,page} = this.props;
        if (prevProps.filter.address !== filter.address && page.router == 'account') {
            this.loadTransactions();
        }
    }

    onChange = (page, pageSize) => {
        this.loadTransactions(page, pageSize);
    };

    loadTransactions = async (page = 1, pageSize = 20) => {

        let {filter, isinternal=false, address=false, isContract=false,  getCsvUrl} = this.props;

        this.setState(
            {
                loading: true,
                page: page,
                pageSize: pageSize,
            }
        );

        let transactions, total,rangeTotal = 0;

        if(!isinternal ){
            if(address){
                const params = {
                    sort: '-timestamp',
                    total: this.state.total,
                    start_timestamp:this.start,
                    end_timestamp:this.end,
                    ...filter,
                }
                let data = {}
                let countData = {}
                let totalData = {}
                let allData = [];
                const query = qs.stringify({ format: 'csv',...params})
                if(isContract){
                    getCsvUrl(`${API_URL}/api/contracts/transaction?${query}`);

                    allData = await Promise.all([
                        Client.getContractTxs({
                            limit: pageSize,
                            start: (page - 1) * pageSize,
                            ...params,
                        }),
                        Client.getCountByType({
                            type: 'contract', 
                            ...filter
                        })
                    ]).catch(e => {
                        console.log('error:' + e);
                    });
                    [data, countData] = allData;
                    transactions = data.transactions;
                    total = countData.count;
                    rangeTotal = data.rangeTotal;

                }else{
                    getCsvUrl(`${API_URL}/api/transaction?${query}`);

                    allData = await Promise.all([
                        Client.getTransactions({
                            limit: pageSize,
                            start: (page - 1) * pageSize,
                            ...params,
                        }),
                        Client.getTransactions({
                            limit: 0,
                            start: (page - 1) * pageSize,
                            ...params,
                        }),
                        Client.getTransactions({
                            limit: 0,
                            ...filter
                        })
                    ]).catch(e => {
                        console.log('error:' + e);
                    });
                    [data, totalData, countData] = allData;
                    transactions = data.transactions;
                    total = countData.rangeTotal;
                    rangeTotal = totalData.rangeTotal;
                }

            }else{
                let data = {}
                let countData = {}
                let totalData = {}
                let allData = [];
                allData = await Promise.all([
                    Client.getTransactions({
                        sort: '-timestamp',
                        limit: pageSize,
                        start: (page - 1) * pageSize,
                        total: this.state.total,
                        ...filter,
                    }),
                    Client.getTransactions({
                        limit: 0,
                        start: (page - 1) * pageSize,
                        ...filter,
                    })
                ]).catch(e => {
                    console.log('error:' + e);
                });
                [data, totalData] = allData;
                transactions = data.transactions;
                total = totalData.total;
                rangeTotal = totalData.rangeTotal;

            }

        }else {
            // TODO internal transctions

            let data = await Client.getInternalTransaction({
                limit: pageSize,
                start: (page - 1) * pageSize,
                address: filter.address,
                start_timestamp: this.start,
                end_timestamp: this.end,
            });

            let newdata = rebuildList(data.list, 'tokenId', 'callValue', 'valueInfoList')
            transactions = newdata;
            total = data.total;
            rangeTotal = data.rangeTotal
        }

        this.setState({
            transactions,
            total,
            rangeTotal,
            loading: false,
        });
    };

    changeType() {
        let { timeType } = this.state;

        this.setState({
            timeType: !timeType
        });
    }

    customizedColumn = (activeLanguage) => {
        let {intl,filter} = this.props;
        const { 
            timeType,
            typeOptionsAry,typeFilter,
            statusFilter,statusOptionsAry,
            resultFilter,resultOptionsAry,
            tokenFilter,tokenOptionsAry,
        } = this.state;
        const typeFilterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div>
                <div style={{padding: "5px 12px"}}>
                    <Checkbox
                        indeterminate={typeFilter.indeterminate}
                        onChange={
                            e => {
                                let obj = {
                                  checkedList: e.target.checked ? [1,2,3,4,5,6] : [],
                                  indeterminate: false,
                                  checkAll: e.target.checked,
                                }
                              this.setState({
                                typeFilter:obj
                              });
                            }
                        }
                        checked={typeFilter.checkAll}
                    >
                        {upperFirst(intl.formatMessage({id: 'address_account_table_filter_all'}))}
                    </Checkbox>
                </div>
                <div>
                    <CheckboxGroup
                        options={typeOptionsAry}
                        value={typeFilter.checkedList}
                        onChange={(checkedList)=> {
                            let obj = {
                                checkedList,
                                indeterminate: !!checkedList.length && checkedList.length < typeOptionsAry.length,
                                checkAll: checkedList.length === typeOptionsAry.length,
                            }
                            this.setState({
                                typeFilter:obj
                            })
                        }}  
                    />
                </div>
            </div>
        )
        const statusFilterDropdown =  ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div>
                <div style={{padding: "5px 12px"}}>
                    <Checkbox
                        indeterminate={statusFilter.indeterminate}
                        onChange={
                            e => {
                                let obj = {
                                  checkedList: e.target.checked ? [1,2] : [],
                                  indeterminate: false,
                                  checkAll: e.target.checked,
                                }
                              this.setState({
                                  statusFilter:obj
                              })
                            }
                        }
                        checked={statusFilter.checkAll}
                    >
                        {upperFirst(intl.formatMessage({id: 'address_account_table_filter_all'}))}
                    </Checkbox>
                </div>
                <div>
                    <CheckboxGroup
                        options={statusOptionsAry}
                        value={statusFilter.checkedList}
                        onChange={(checkedList)=> {
                            let obj = {
                                checkedList,
                                indeterminate: !!checkedList.length && checkedList.length < statusOptionsAry.length,
                                checkAll: checkedList.length === statusOptionsAry.length,
                            }
                            this.setState({
                                statusFilter:obj
                            })
                        }}
                        />
                </div>
            </div>
        )
        const resultFilterDropdown =  ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div>
                <div style={{padding: "5px 12px"}}>
                    <Checkbox
                        indeterminate={resultFilter.indeterminate}
                        onChange={
                            e => {
                                let obj = {
                                  checkedList: e.target.checked ? [1,2] : [],
                                  indeterminate: false,
                                  checkAll: e.target.checked,
                                }
                              this.setState({
                                resultFilter:obj
                              })
                            }
                        }
                        checked={resultFilter.checkAll}
                    >
                        {upperFirst(intl.formatMessage({id: 'address_account_table_filter_all'}))}
                    </Checkbox>
                </div>
                <div>
                    <CheckboxGroup
                        options={resultOptionsAry}
                        value={resultFilter.checkedList}
                        onChange={(checkedList)=> {
                            let obj = {
                                checkedList,
                                indeterminate: !!checkedList.length && checkedList.length < resultOptionsAry.length,
                                checkAll: checkedList.length === resultOptionsAry.length,
                            }
                            this.setState({
                                resultFilter:obj
                            })
                        }}
                        />
                </div>
            </div>
        )
        const tokenFilterDropdown =  ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div>
                <div style={{padding: "5px 12px"}}>
                    <Checkbox
                        indeterminate={tokenFilter.indeterminate}
                        onChange={
                            e => {
                                let obj = {
                                  checkedList: e.target.checked ? [1,2] : [],
                                  indeterminate: false,
                                  checkAll: e.target.checked,
                                }
                              this.setState({
                                tokenFilter:obj
                              })
                            }
                        }
                        checked={tokenFilter.checkAll}
                    >
                        {upperFirst(intl.formatMessage({id: 'address_account_table_filter_all'}))}
                    </Checkbox>
                </div>
                <div>
                    <CheckboxGroup
                        options={tokenOptionsAry}
                        value={tokenFilter.checkedList}
                        onChange={(checkedList)=> {
                            let obj = {
                                checkedList,
                                indeterminate: !!checkedList.length && checkedList.length < tokenOptionsAry.length,
                                checkAll: checkedList.length === tokenOptionsAry.length,
                            }
                            this.setState({
                                tokenFilter:obj
                            })
                        }}
                        />
                </div>
            </div>
        )

       
        let column = [
            {
                title: upperFirst(intl.formatMessage({id: 'transaction_hash'})),
                dataIndex: 'hash',
                key: 'hash',
                align: 'left',
                width:'8%',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <Truncate>
                        <TransactionHashLink hash={text}>
                            {text}
                        </TransactionHashLink>
                    </Truncate>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'block' })),
                dataIndex: 'block',
                key: 'block',
                align: 'left',
                className: 'ant_table',
                width: '10%',
                render: (text, record, index) => {
                    return <BlockNumberLink number={record.block}/>
                }
            },
            {
                title: (
                    <span
                        className="token-change-type"
                        onClick={this.changeType.bind(this)}
                    >
                        {upperFirst(
                        intl.formatMessage({
                            id: timeType ? "age" : "trc20_cur_order_header_order_time"
                        })
                        )}
                        <Icon
                        type="retweet"
                        style={{
                            verticalAlign: 0,
                            marginLeft: 10
                        }}
                        />
                    </span>
                ),
                dataIndex: 'timestamp',
                key: 'timestamp',
                align: 'left',
                className: 'ant_table',
                width: activeLanguage ==='ru' ? '12%' : '15%',
                render: (text, record, index) => {
                    return(
                        <div>
                            {timeType ? (
                            <BlockTime time={Number(record.timestamp)}> </BlockTime>
                            ) : (
                            <span className="">
                                <FormattedDate value={record.timestamp} /> &nbsp;
                                <FormattedTime
                                value={record.timestamp}
                                hour="numeric"
                                minute="numeric"
                                second="numeric"
                                hour12={false}
                                />
                            </span>
                            )}
                        </div>
                    ) 
                        
                    // <BlockTime time={text}></BlockTime>
                    // <TimeAgo date={text} title={moment(text).format("MMM-DD-YYYY HH:mm:ss A")}/>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'initiate_address'})),
                dataIndex: 'ownerAddress',
                key: 'ownerAddress',
                align: 'left',
                width:'5%',
                className: 'ant_table address_max_width',
                render: (text, record, index) => {
                    return (
                       <span>
                        {
                            record.ownerAddress == filter.address ?   
                            <TruncateAddress>{text}</TruncateAddress>
                            :<AddressLink address={text}>{text}</AddressLink>
                        }
                       </span>
                          
                    )
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'transaction_type'})),
                dataIndex: 'contractType',
                key: 'contractType',
                align: 'left',
                width: '20%',
                filterIcon: () => {
                    return (
                        <Icon type="caret-down" style={{fontSize:12,color:'#999'}}  theme="outlined" />
                    );
                },
                filterDropdown: typeFilterDropdown,
                onFilterDropdownVisibleChange: (visible) => {
                    if (visible) {
                        console.log('visible')
                    }else{
                        console.log('dispair')
                    }
                },
                className: 'ant_table _text_nowrap',
                render: (text, record, index) => {
                    return <span>{ContractTypes[text]}</span>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'status'})),
                dataIndex: 'status',
                key: 'status',
                align: 'left',
                width: activeLanguage ==='ru' ? '34%' :'16%',
                filterIcon: () => {
                    return (
                        <Icon type="caret-down" style={{fontSize:12,color:'#999'}}  theme="outlined" />
                    );
                },
                filterDropdown: statusFilterDropdown,
                onFilterDropdownVisibleChange: (visible) => {
                    if (visible) {
                        console.log('visible')
                    }else{
                        console.log('dispair')
                    }
                },
                className: 'ant_table',
                render: (text, record, index) => {
                    return (
                        <span>
                             {
                                record.confirmed ?
                                    <span  className="d-flex"><img style={{ width: "20px", height: "20px" }} src={require("../../images/contract/Verified.png")}/> <span>{tu('full_node_version_confirmed')}</span></span>
                                      : 
                                    <span  className="d-flex"><img style={{ width: "20px", height: "20px" }} src={require("../../images/contract/Unverified.png")}/> <span>{tu('full_node_version_unconfirmed')}</span></span>
                            }
                        </span>
                    )
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'result' })),
                dataIndex: 'contractRet',
                key: 'contractRet',
                align: 'left',
                className: 'ant_table',
                width: '14%',
                filterIcon: () => {
                    return (
                        <Icon type="caret-down" style={{fontSize:12,color:'#999'}}  theme="outlined" />
                    );
                },
                filterDropdown: resultFilterDropdown,
                onFilterDropdownVisibleChange: (visible) => {
                    if (visible) {
                        console.log('visible')
                    }else{
                        console.log('dispair')
                    }
                },
                render: (text, record, index) => {
                    return <span>{text}</span>
                }
            },
            {
                title: upperFirst(
                  intl.formatMessage({
                    id: "amount"
                  })
                ),
                dataIndex: "amount",
                key: "amount",
                align: "left",
                className: "ant_table",
                render: (text, record, index) => {
                  return <FormattedNumber value={record.contractData.amount / Math.pow(10,6)}></FormattedNumber>;
                }
            },
            {
                title: (
                    <span>
                        {
                            upperFirst(
                                intl.formatMessage({
                                    id: "tokens"
                                })
                            )
                        }
                        <span style={{position:'absolute',right:0,left:'92%'}}>
                            <QuestionMark
                                placement="top"
                                text="account_tab_transactions_token_info"
                            />
                        </span>
                       
                    </span>
                ),
                dataIndex: "tokens",
                align: "left",
                key: "tokens",
                className: "ant_table",
                filterIcon: () => {
                    return (
                        <Icon type="caret-down" style={{fontSize:12,color:'#999'}}  theme="outlined" />
                    );
                },
                filterDropdown: tokenFilterDropdown,
                onFilterDropdownVisibleChange: (visible) => {
                    if (visible) {
                        console.log('visible')
                    }else{
                        console.log('dispair')
                    }
                },
                render: (text, record, index) => {
                    return <span> {record.map_token_name_abbr} </span>;
                }
            }
       
        ];
        return column;
    }

    trc20CustomizedColumn = () => {
        let {intl} = this.props;
       
        let column = [

            {
                title: upperFirst(intl.formatMessage({id: 'hash'})),
                dataIndex: 'hash',
                key: 'hash',
                align: 'left',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <Truncate>
                        <TransactionHashLink hash={text}>
                            {text}
                        </TransactionHashLink>
                    </Truncate>
                }
            },
            // {
            //   title: upperFirst(intl.formatMessage({id: 'age'})),
            //   dataIndex: 'timestamp',
            //   key: 'timestamp',
            //   align: 'left',
            //   className: 'ant_table',
            //   width: '14%',
            //   render: (text, record, index) => {
            //     return <TimeAgo date={text}/>
            //   }
            // },
            {
                title: upperFirst(intl.formatMessage({id: 'from'})),
                dataIndex: 'from',
                key: 'from',
                align: 'left',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <AddressLink address={text}/>
                }
            },
            {
                title: '',
                className: 'ant_table',
                width: '30px',
                render: (text, record, index) => {
                    return <img src={require("../../images/arrow.png")}/>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'to'})),
                dataIndex: 'to',
                key: 'to',
                align: 'left',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <AddressLink address={text}/>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'trc20_my_trans_header_status'})),
                dataIndex: 'rejected',
                key: 'rejected',
                align: 'left',
                className: 'ant_table _text_nowrap',
                render: (text, record, index) => {
                    return <span>
              {
                  text?<img style={{width: '20px', height: '20px'}} src={require("../../images/internal_error.png")}/>:<img style={{width: '20px', height: '20px'}} src={require("../../images/internal_success.png")}/>
              }
          </span>
                }

            },
            {
                title: upperFirst(intl.formatMessage({id: 'amount'})),
                dataIndex: 'valueInfoList',
                key: 'valueInfoList',
                align: 'right',
                className: 'ant_table _text_nowrap',
                render: (text, record, index) => {
                    return record.valueInfoList.map((item,index) => {
                        return <span key={index}><NameWithId value={item}/><span className={index == record.valueInfoList.length -1? 'd-none': ''}>, </span></span>
                    })
                }
            },
            // {
            //   title: upperFirst(intl.formatMessage({id: 'contract_type'})),
            //   dataIndex: 'contractType',
            //   key: 'contractType',
            //   align: 'right',
            //   width: '20%',
            //   className: 'ant_table _text_nowrap',
            //   render: (text, record, index) => {
            //     return <span>{ContractTypes[text]}</span>
            //   }
            // },
        ];
        return column;
    }

    onDateOk (start,end) {
        this.start = start.valueOf();
        this.end = end.valueOf();
        this.loadTransactions(1);
    }


    render() {

        let {transactions, total, rangeTotal, loading, EmptyState = null,filterTitleKey} = this.state;
        let {intl, isinternal, address = false,activeLanguage} = this.props;
       
        let column = !isinternal? this.customizedColumn(activeLanguage):
            this.trc20CustomizedColumn();
       // let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'transactions_unit'})

        // if (!loading && transactions && transactions.length === 0) {
        //   if (!EmptyState) {
        //     return (
        //         <div className="p-3 text-center no-data">{tu("no_transactions")}</div>
        //     );
        //   }
        //   return <EmptyState/>;
        // }

        return (
          <div className={"token_black " + (address ? "mt-5" : "")} style={{padding:'30px 0'}}>
            {loading && (
              <div className="loading-style">
                <TronLoader />
              </div>
            )}
            <div style={{marginBottom:'20px'}}>
                {address ? (
                <DateSelect
                    onDateOk={(start, end) => this.onDateOk(start, end)}
                    dataStyle={{ marginTop: "-3.3rem" }}
                />
                ) : (
                ""
                )}
            </div>
            <div>
                {!loading && (
                    <TotalInfo
                        total={total}
                        rangeTotal={rangeTotal}
                        typeText="transactions_unit"
                        common={!address}
                        // top={address ? "-28px" : "26"}
                        selected
                    />
                )}
            </div>
         
            {!loading && transactions.length === 0 ? (
              <div className="p-3 text-center no-data">
                {tu("no_transactions")}
              </div>
            ) : (
                <div className={isMobile ? "pt-5":null}>
                    <SmartTable
                        bordered={true}
                        loading={loading}
                        position="bottom"
                        column={column}
                        data={transactions}
                        total={rangeTotal > 2000 ? 2000 : rangeTotal}
                        current={this.state.page}
                        onPageChange={(page, pageSize) => {
                        this.loadTransactions(page, pageSize);
                        }}
                        locale={{
                            filterTitle: filterTitleKey || 'default', // prevent console error ，remove result => filterTitle ''fail；
                        }}
                    />
                </div>
            )}
          </div>
        );
    }
}
function mapStateToProps(state) {
    return {
      activeLanguage: state.app.activeLanguage,
    };
  }

export default  connect(mapStateToProps)(injectIntl(NewTransactions));