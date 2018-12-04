import React from "react";
import {tu} from "../../../utils/i18n";
import {FormattedNumber,injectIntl} from "react-intl";
import {filter} from "lodash";
import {TokenLink} from "../../common/Links";
import {SwitchToken} from "../../common/Switch";
import SmartTable from "../../common/SmartTable.js"
import {upperFirst} from "lodash";
import _ from "lodash";

export  class TokenBalances extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hideSmallCurrency:true,
            balances:[],
            emptyState: props.emptyState,
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
        let balances;
        if(hideSmallCurrency){
            balances = _(tokenBalances)
                .filter(tb => tb.name.toUpperCase() !== "TRX")
                .filter(tb => tb.balance >= 10)
                .sortBy(tb => tb.name)
                .value();
        }else{
            balances = _(tokenBalances)
                .filter(tb => tb.name.toUpperCase() !== "TRX")
                .filter(tb => tb.balance > 0)
                .sortBy(tb => tb.name)
                .value();
        }
        this.setState({
            page,
            balances,
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
                dataIndex: 'name',
                key: 'name',
                align: 'left',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <TokenLink name={text} address={record.address}/>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'balance'})),
                dataIndex: 'balance',
                key: 'balance',
                align: 'right',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <FormattedNumber value={text}/>
                }
            },

        ];
        return column;
    }
    render() {

        let {page, total, pageSize, loading, balances, emptyState: EmptyState = null} = this.state;
        let column = this.customizedColumn();
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
                  <div className="table_pos_info d-md-block table_pos_info_addr">
                      {tableInfo}
                  </div>
                  <div className="table_pos_switch d-md-block table_pos_switch_addr">
                    <SwitchToken  handleSwitch={this.handleSwitch} text="hide_small_currency" hoverText="tokens_less_than_10"/>
                  </div>
                </div>
               <SmartTable bordered={true} column={column} data={balances} total={balances.length} locale={locale} addr="address"/>
            </div>
        )
    }
}

export default injectIntl(TokenBalances)
