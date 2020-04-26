import React from "react";
import {tu} from "../../../utils/i18n";
import {FormattedNumber, injectIntl} from "react-intl";
import {toUpper} from "lodash";
import {TokenLink, TokenTRC20Link, AddressLink} from "../../common/Links";
import {SwitchToken} from "../../common/Switch";
import { Truncate } from "../../common/text";
import SmartTable from "../../common/SmartTable.js"
import {upperFirst} from "lodash";
import _ from "lodash";
import { CONTRACT_ADDRESS_USDT, CONTRACT_ADDRESS_WIN, CONTRACT_ADDRESS_GGC } from "../../../constants";
import {TRXPrice} from "../../common/Price";
import {Table, Menu, Dropdown,Tooltip,Icon} from 'antd'
import { ONE_TRX } from "../../../constants";
import { recoverAddress } from "ethers/utils";


class TokenBalances extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hideSmallCurrency:false,
            balances:[],
            emptyState: props.emptyState,
            tokenTRC10:true,
            pagination: {
                showQuickJumper: true,
                position: "bottom",
                showSizeChanger: true,
                defaultPageSize: 20,
                total: 0
            },
            filterType: 'ALL'
        };
    }

    componentDidMount() {
        this.load();
    }

    onChange = (page, pageSize) => {
        this.load(page, pageSize);
    };

    load =  (page = 1, pageSize = 20) => {
        let {hideSmallCurrency, filterType} = this.state;
        let {tokenBalances} = this.props;
        tokenBalances = _(tokenBalances).sortBy(tb => -tb.TRXBalance).value()
        let tokenHasTRXValue =  _(tokenBalances).filter(tb => tb.TRXBalance > 0).sortBy(tb => -tb.TRXBalance).value();
        let tokenNotTRXValue =  _(tokenBalances).filter(tb => tb.TRXBalance <= 0).sortBy(tb => toUpper(tb.map_token_name)).value();
        let tokens = tokenHasTRXValue.concat(tokenNotTRXValue);
        
        if(hideSmallCurrency){
            tokens = _(tokens)
                .filter(tb => (tb.TRXBalance).toString() >= 10)
                .value();

        }
        
        if(filterType != 'ALL'){
            tokens = _(tokens)
                .filter(tb => tb.tokenType == filterType)
                .value();
        }
        

        this.setTop(tokens,CONTRACT_ADDRESS_GGC)
        this.setTop(tokens,CONTRACT_ADDRESS_WIN)
        this.setTop(tokens,CONTRACT_ADDRESS_USDT)
        this.setTop(tokens,'1002000');
        this.setTop(tokens,'_');
        this.setState({
            page,
            balances:tokens,
        });
    };

    setTop = (balances,id) =>{
        let btt = balances.find(function(elem){
            return elem['map_token_id']=== id;
        });
        var bttIndex = balances.findIndex(function(elem){
            return elem['map_token_id']=== id;
        });
        if(bttIndex>-1) {
            balances.splice(bttIndex, 1);
            balances.unshift(btt);
        }
    }

    handleSwitch = (val) => {
        this.setState({
            hideSmallCurrency: val
        },() => {
            this.load();
        });
    }
    handleMenuClick = (e) => {
        this.setState({
            filterType: e.key
        },() => {
            this.load();
        })
    }

    customizedColumn = () => {
        let {intl, frozen} = this.props;
        let { filterType } = this.state;
        const defaultImg = require("../../../images/logo_default.png");
        const menu =   (<Menu onClick={this.handleMenuClick} className="list-filter">
                            <Menu.Item  key="ALL" className={`${filterType == 'ALL' && 'active'}`}>
                                <div>{tu('all')}</div>
                            </Menu.Item>
                            <Menu.Item key="TRC10" className={`${filterType == 'TRC10' && 'active'}`}>
                                <div>TRC10</div>
                            </Menu.Item>
                            <Menu.Item key="TRC20" className={`${filterType == 'TRC20' && 'active'}`}>
                                <div>TRC20</div>
                            </Menu.Item>
                        </Menu>)
        const droplist = (
                <Dropdown overlay={menu} placement="bottomLeft">
                    <span style={{position: 'relative'}}>
                        {upperFirst(intl.formatMessage({id: 'address_balance_token_type'}))}
                        <i className="arrow-down"></i>
                    </span>
                </Dropdown>
        )
        let column = [
            {
                title: upperFirst(intl.formatMessage({id: 'token'})),
                dataIndex: 'map_token_name',
                key: 'map_token_name',
                width: '22%',
                align: 'left',
                className: 'ant_table',
                render: (text, record, index) => {
                    return (

                            record.map_token_id == 1002000  || record.map_token_id == CONTRACT_ADDRESS_USDT || record.map_token_id == CONTRACT_ADDRESS_WIN || record.map_token_id == CONTRACT_ADDRESS_GGC ?<div>
                                <b className="token-img-top" style={{marginRight: 5}}>
                                    <img width={20} height={20} src={record.map_amount_logo} onError={e => {
                          e.target.onerror = null;
                          e.target.src = defaultImg;
                        }}/>
                                    <i style={{width: 10, height: 10, bottom: -5}}></i>
                                </b>
                                    {
                                        record.tokenType == 'TRC20'?
                                        <TokenTRC20Link name={record.map_token_id} address={record.contract_address} namePlus={record.map_token_name + ' (' + record.map_token_name_abbr + ')'}/>
                                        :
                                        <TokenLink id={record.map_token_id} name={record.map_token_name+' ('+record.map_token_name_abbr+")"} address={record.address}/>

                                    }
                            </div>
                            :
                            <div>
                                <img width={20} height={20} src={record.map_amount_logo} style={{marginRight: 5}} onError={e => {
                          e.target.onerror = null;
                          e.target.src = defaultImg;
                        }}/>
                                {
                                    record.tokenType == 'TRC20'?
                                        <TokenTRC20Link name={record.map_token_id} address={record.contract_address} namePlus={record.map_token_name + ' (' + record.map_token_name_abbr + ')'}/>
                                        :
                                        <TokenLink id={record.map_token_id} name={record.map_token_name+' ('+record.map_token_name_abbr+")"} address={record.address}/>


                                }
                            </div>


                    )
                }
            },
            {
                title: droplist,
                dataIndex: 'tokenType',
                key: 'tokenType',
                align: 'left',
                width: '10%',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <span>{text}</span>
                }
            },
            {
                title: 'ID（Contract）',
                dataIndex: 'map_token_id',
                key: 'map_token_id',
                align: 'left',
                width: '15%',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <div>
                        {
                            record.tokenType == 'TRC20' ? 
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
                                <AddressLink address={record.contract_address} isContract={true}>{record.contract_address}</AddressLink>
                                </span>
                            : (isNaN(text)?'-':text)
                        }
                    </div>
                }
            },
            // {
            //     title: upperFirst(intl.formatMessage({id: 'TRC20_decimals'})),
            //     dataIndex: 'map_token_precision',
            //     key: 'map_token_precision',
            //     align: 'left',
            //     className: 'ant_table',
            //     render: (text, record, index) => {
            //         return <span>{text}</span>
            //     }
            // },
            {
                title: upperFirst(intl.formatMessage({id: 'data_number'})),
                dataIndex: 'map_amount',
                key: 'map_amount',
                width: '22%',
                sorter: (a, b) => a.map_amount - b.map_amount,
                align: 'left',
                className: 'ant_table',
                render: (text, record, index) => {

                    return <span>
                        <FormattedNumber value={text}  maximumFractionDigits={Number(record.map_token_precision)}/>
                        <span>
                            {' '}
                           {/* &nbsp;{record.map_token_name_abbr} */}
                        </span>
                        {record.map_token_name==='TRX' ? 
                            (<span>
                                ({tu("address_tron_power_remaining")}:{" "}
                                <FormattedNumber value={record.available_amount}  maximumFractionDigits={Number(record.map_token_precision)}/>)
                            </span>)
                            : ''
                        }
                    </span> 
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'price'}))+'(TRX)',
                dataIndex: 'priceInTrx',
                key: 'priceInTrx',
                sorter: (a, b) => a.priceInTrx - b.priceInTrx,
                align: 'left',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <span>{text?
                        <span>
                            {text}&nbsp;
                        </span>
                         :'-'
                    }</span>
                }
            },
            {
                title:  upperFirst(intl.formatMessage({id: 'address_balance_token_price_TRX'})),
                dataIndex: 'TRXBalance',
                key: 'TRXBalance',
                sorter: (a, b) => a.TRXBalance_toThousands - b.TRXBalance_toThousands,
                align: 'left',
                className: 'ant_table',
                render: (text, record, index) => {
                    return (<span>
                        {record.TRXBalance? <div>
                            <div>
                                {record.TRXBalance_toThousands} TRX
                            </div>
                            <div className="small" style={{color: '#999'}}>
                                ≈<TRXPrice amount={record.TRXBalance}
                                          currency="USD"
                                          showPopup={false}/>
                            </div>

                        </div>:'-'}
                    </span>)
                }
            },


        ];
        return column;
    }

    customizedColumnTRC20 = () => {
        let {intl} = this.props;
        let column = [
            {
                title: upperFirst(intl.formatMessage({id: 'token'})),
                dataIndex: 'map_token_name',
                key: 'map_token_name',
                width: '20%',
                align: 'left',
                className: 'ant_table',
                render: (text, record, index) => {
                    return (
                        record.contract_address == CONTRACT_ADDRESS_USDT || record.contract_address == CONTRACT_ADDRESS_WIN || record.contract_address == CONTRACT_ADDRESS_GGC ?<div className="map-token-top">
                            <TokenTRC20Link name={record.name} address={record.contract_address} namePlus={record.name + ' (' + record.symbol + ')'}/>
                            <i></i>
                        </div>: <TokenTRC20Link name={record.name} address={record.contract_address} namePlus={record.name + ' (' + record.symbol + ')'}/>
                    )
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'balance'})),
                dataIndex: 'map_amount',
                key: 'map_amount',
                align: 'right',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <span>{record.token20_balance}</span>
                }
            },

        ];
        return column;
    }

    handleTRC10Token = () => {
        this.setState({tokenTRC10: true});
    }

    handleTRC20Token = () => {
        this.setState({tokenTRC10: false});
    }

    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        pager.pageSize = pagination.pageSize;
        this.setState(
            {
                pagination: pager,
                // sort: `${sorter.order === "descend" ? "-" : ""}${
                //   sorter.order ? sorter.columnKey : ""
                // }`
            },
            () => this.load(pager.current, pager.pageSize)
        );
    };

    render() {

        let {page, total, pageSize, loading, balances, TRC20balances, emptyState: EmptyState = null, tokenTRC10, pagination, filterType} = this.state;
        let column = this.customizedColumn();
        let columnTRC20 = this.customizedColumnTRC20();
        let {intl} = this.props;
        let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + balances.length + ' ' + intl.formatMessage({id: 'token_unit'})
        let locale  = {emptyText: intl.formatMessage({id: 'no_tokens_found'})}
        // if (Object.keys(balances).length === 0 || (Object.keys(balances).length === 1 && balances[0].name === "TRX")) {
        //     if (!EmptyState) {
        //         return (
        //             <div className="text-center p-3 no-data">
        //                 {tu("no_tokens_found")}
        //             </div>
        //         );
        //     }
        //     return <EmptyState />;
        // }
        return (
            <div className="token_black table_pos token-balance-wrap">
                <div className="d-flex mt-4" >
                  <div className=" d-md-block table_pos_info_addr d-none mr-3">
                      {tableInfo}
                  </div>
                  <div className={" d-md-block " + (balances.length ? "table_pos_switch_addr4" : "")}>
                    <SwitchToken  handleSwitch={this.handleSwitch} text="hide_small_currency" hoverText="address_token_less_than_10"/>
                  </div>
                </div>
                {/*<div className={"account-token-tab address-token-tab " + (balances.length ? '' : "address-token-tab-mobile")}>*/}
                    {/*<a href="javascript:;"*/}
                       {/*className={"btn btn-default btn-sm" + (tokenTRC10 ? ' active' : '')}*/}
                       {/*onClick={this.handleTRC10Token}>*/}
                        {/*{tu("TRC10_token")}*/}
                    {/*</a>*/}
                    {/*<a href="javascript:;"*/}
                       {/*className={"btn btn-default btn-sm ml-2" + (tokenTRC10 ? '' : ' active')}*/}
                       {/*onClick={this.handleTRC20Token}>*/}
                        {/*{tu("TRC20_token")}*/}
                    {/*</a>*/}
                {/*</div>*/}
                <div>
                    {
                       // Object.keys(balances).length === 0 || (Object.keys(balances).length === 1 && balances[0].map_token_name === "TRX")?
                        Object.keys(balances).length === 0 && filterType == 'ALL'?
                            <div className="text-center p-3 no-data">
                                {tu("no_tokens_found")}
                            </div>
                            :
                            <div className="mt-1">
                                {/* <SmartTable bordered={true} column={column} data={balances} total={balances.length} locale={locale} addr="address"/> */}
                            
                                <Table
                                    bordered={true}
                                    columns={column}
                                    rowKey={(record, index) => {
                                    return index;
                                    }}
                                    dataSource={balances}
                                    scroll={scroll}
                                    pagination={pagination}
                                    loading={loading}
                                    onChange={this.handleTableChange}
                                />
                            </div>
                    }
                </div>

               
            </div>
        )
    }
}

export default injectIntl(TokenBalances);

