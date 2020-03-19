import React from "react";
import {tu} from "../../../utils/i18n";
import {FormattedNumber, injectIntl} from "react-intl";
import {toUpper} from "lodash";
import {TokenLink, TokenTRC20Link} from "../../common/Links";
import {SwitchToken} from "../../common/Switch";
import SmartTable from "../../common/SmartTable.js"
import {upperFirst} from "lodash";
import _ from "lodash";
import { CONTRACT_ADDRESS_USDT, CONTRACT_ADDRESS_WIN, CONTRACT_ADDRESS_GGC } from "../../../constants";
import {TRXPrice} from "../../common/Price";


class TokenBalances extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hideSmallCurrency:false,
            balances:[],
            emptyState: props.emptyState,
            tokenTRC10:true,
        };
    }

    componentDidMount() {
        this.load();
    }

    onChange = (page, pageSize) => {
        this.load(page, pageSize);
    };

    load =  (page = 1, pageSize = 20) => {
        let {hideSmallCurrency} = this.state;
        let {tokenBalances} = this.props;
        tokenBalances = _(tokenBalances).sortBy(tb => -tb.TRXBalance).value()
        let tokenHasTRXValue =  _(tokenBalances).filter(tb => tb.TRXBalance > 0).sortBy(tb => -tb.TRXBalance).value();
        let tokenNotTRXValue =  _(tokenBalances).filter(tb => tb.TRXBalance <= 0).sortBy(tb => toUpper(tb.map_token_name)).value();
        let tokens = tokenHasTRXValue.concat(tokenNotTRXValue);

        if(hideSmallCurrency){
            tokens = _(tokens)
                .filter(tb => tb.map_amount >= 10)
                .value();

        }else{
            tokens = _(tokens)
                .filter(tb => tb.map_amount > 0)
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


    customizedColumn = () => {
        let {intl} = this.props;
        const defaultImg = require("../../../images/logo_default.png");

        let column = [
            {
                title: upperFirst(intl.formatMessage({id: 'token'})),
                dataIndex: 'map_token_name',
                key: 'map_token_name',
                width: '25%',
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
                title: upperFirst(intl.formatMessage({id: 'address_balance_token_type'})),
                dataIndex: 'tokenType',
                key: 'tokenType',
                align: 'left',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <span>{text}</span>
                }
            },
            {
                title: 'ID',
                dataIndex: 'map_token_id',
                key: 'map_token_id',
                align: 'left',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <span>{isNaN(text)?'-':text}</span>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'TRC20_decimals'})),
                dataIndex: 'map_token_precision',
                key: 'map_token_precision',
                align: 'left',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <span>{text}</span>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'balance'})),
                dataIndex: 'map_amount',
                key: 'map_amount',
                width: '18%',
                align: 'left',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <span>
                        <FormattedNumber value={text}  maximumFractionDigits={Number(record.map_token_precision)}/>
                        <span>
                           &nbsp;{record.map_token_name_abbr}
                        </span>
                    </span> 
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'price'})),
                dataIndex: 'priceInTrx',
                key: 'priceInTrx',
                align: 'left',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <span>{text?
                        <span>
                            {text}&nbsp;TRX
                        </span>
                         :'-'
                    }</span>
                }
            },
            {
                title:  upperFirst(intl.formatMessage({id: 'address_balance_token_price_TRX'})),
                dataIndex: 'TRXBalance',
                key: 'TRXBalance',
                align: 'left',
                className: 'ant_table',
                render: (text, record, index) => {
                    return (<span>
                        {record.TRXBalance? <div>
                            <div>
                                {record.TRXBalance_toThousands} TRX
                            </div>
                            <div className="small">
                                <TRXPrice amount={record.TRXBalance}
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
    render() {

        let {page, total, pageSize, loading, balances, TRC20balances, emptyState: EmptyState = null, tokenTRC10} = this.state;
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
            <div className="token_black table_pos">
                <div className=" d-flex justify-content-between" style={{left: 'auto'}}>
                  <div className="table_pos_info d-md-block table_pos_info_addr d-none">
                      {tableInfo}
                  </div>
                  <div className={"table_pos_switch d-md-block " + (balances.length ? "table_pos_switch_addr4" : "")}>
                    <SwitchToken  handleSwitch={this.handleSwitch} text="hide_small_currency" hoverText="tokens_less_than_10"/>
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
                        Object.keys(balances).length === 0?
                        <div className="text-center p-3 no-data">
                                {tu("no_tokens_found")}
                            </div>
                            :
                            <div className="mt-1">
                                <SmartTable bordered={true} column={column} data={balances} total={balances.length} locale={locale} addr="address"/>
                            </div>
                    }
                </div>

               
            </div>
        )
    }
}

export default injectIntl(TokenBalances);

