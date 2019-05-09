import React from "react";
import {tu} from "../../../utils/i18n";
import {FormattedNumber, injectIntl} from "react-intl";
import {filter} from "lodash";
import {TokenLink, TokenTRC20Link} from "../../common/Links";
import {SwitchToken} from "../../common/Switch";
import SmartTable from "../../common/SmartTable.js"
import {upperFirst} from "lodash";
import _ from "lodash";
import { CONTRACT_ADDRESS_USDT } from "../../../constants";

import rebuildList from "../../../utils/rebuildList";

export  class TokenBalances extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hideSmallCurrency:true,
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
        let {tokenBalances,token20Balances} = this.props;
        console.log('tokenBalances',tokenBalances)
        console.log('token20Balances',token20Balances)
        var btt = tokenBalances.find(function(elem){
          return elem['map_token_id']==='1002000';
        });
        var bttIndex = tokenBalances.findIndex(function(elem){
          return elem['map_token_id']==='1002000';
        });
        if(bttIndex>-1) {
          tokenBalances.splice(bttIndex, 1);
          tokenBalances.unshift(btt);
        }

        let balances,TRC20balances;

        if(hideSmallCurrency){
            balances = _(tokenBalances)
                .filter(tb => tb.name.toUpperCase() !== "_")
                .filter(tb => tb.map_amount >= 10)
                .value();
            TRC20balances = _(token20Balances)
                .filter(tb => tb.token20_balance_decimals >= 10)
                .sortBy(tb => -tb.token20_balance_decimals)
                .value();
        }else{
            balances = _(tokenBalances)
                .filter(tb => tb.name.toUpperCase() !== "_")
                .filter(tb => tb.map_amount > 0)
                .value();
            TRC20balances = _(token20Balances)
                .filter(tb => tb.token20_balance_decimals > 0)
                .sortBy(tb => -tb.token20_balance_decimals)
                .value();
        }
        this.setState({
            page,
            balances,
            TRC20balances,
        });
    };

    handleSwitch = (val) => {
        this.setState({
            hideSmallCurrency: val
        },() => {
            this.load();
        });
    }


    customizedColumn = () => {
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
                        record.map_token_id == 1002000?<div className="map-token-top">
                            <TokenLink id={record.map_token_id} name={record.map_token_name+' ('+record.map_token_name_abbr+")"} address={record.address}/>
                            <i></i>
                        </div>:  <TokenLink id={record.map_token_id} name={record.map_token_name+' ('+record.map_token_name_abbr+")"} address={record.address}/>
                    )
                }
            },
            {
                title: 'ID',
                dataIndex: 'map_token_id',
                key: 'map_token_id',
                align: 'left',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <span>{text}</span>
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
                align: 'right',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <FormattedNumber value={text}  maximumFractionDigits={Number(record.map_token_precision)}/>
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
                        record.contract_address == CONTRACT_ADDRESS_USDT?<div className="map-token-top">
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
        let tableInfo =tokenTRC10? intl.formatMessage({id: 'view_total'}) + ' ' + balances.length + ' ' + intl.formatMessage({id: 'token_unit'}):intl.formatMessage({id: 'view_total'}) + ' ' + TRC20balances.length + ' ' + intl.formatMessage({id: 'token_unit'})
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
                  <div className={"table_pos_switch d-md-block " + (balances.length && tokenTRC10? "table_pos_switch_addr3" : "table_pos_switch_addr4")}>
                    <SwitchToken  handleSwitch={this.handleSwitch} text="hide_small_currency" hoverText="tokens_less_than_10"/>
                  </div>
                </div>
                <div className={"account-token-tab address-token-tab " + (balances.length ? '' : "address-token-tab-mobile")}>
                    <a href="javascript:;"
                       className={"btn btn-default btn-sm" + (tokenTRC10 ? ' active' : '')}
                       onClick={this.handleTRC10Token}>
                        {tu("TRC10_token")}
                    </a>
                    <a href="javascript:;"
                       className={"btn btn-default btn-sm ml-2" + (tokenTRC10 ? '' : ' active')}
                       onClick={this.handleTRC20Token}>
                        {tu("TRC20_token")}
                    </a>
                </div>
                <div>
                    {
                        tokenTRC10?
                            <div>
                                {
                                    Object.keys(balances).length === 0 || (Object.keys(balances).length === 1 && balances[0].map_token_name === "TRX")?
                                        <div className="text-center p-3 no-data">
                                            {tu("no_tokens_found")}
                                        </div>
                                        :
                                        <div className="mt-5">
                                            <SmartTable bordered={true} column={column} data={balances} total={balances.length} locale={locale} addr="address"/>
                                        </div>
                                }
                            </div>:
                            <div>
                                {
                                    Object.keys(TRC20balances).length === 0 ?
                                        <div className="text-center p-3 no-data">
                                            {tu("no_tokens_found")}
                                        </div>
                                        :
                                        <div className="mt-5">
                                            <SmartTable bordered={true} column={columnTRC20} data={TRC20balances} total={TRC20balances.length} locale={locale} addr="address"/>
                                        </div>
                                }
                            </div>




                    }
                </div>

               
            </div>
        )
    }
}

export default injectIntl(TokenBalances)
