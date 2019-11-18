import React from "react";
import {injectIntl} from "react-intl";
import {connect} from "react-redux";
import {tu} from "../../utils/i18n";
import _, {find } from "lodash";
import { Select } from 'antd';
import {reloadWallet} from "../../actions/wallet";
const { Option, OptGroup } = Select;



class TokenBalanceSelect extends React.Component {

    constructor() {
        super();
        this.state = {
            token: '',
        };
    }
    componentDidMount() {
        this.refreshTokenBalances();

        //this.setAddress(this.props.to);

    }

    refreshTokenBalances = () => {
        let {account} = this.props;
        if (account.isLoggedIn) {
            this.props.reloadWallet();
        }
    };

    componentDidUpdate() {
        let {tokenBalances,tokens20} = this.props;
        tokenBalances = _.filter(tokenBalances, tb => tb.balance > 0);

        let {token} = this.state;
        if (!token && tokenBalances.length > 0) {
            this.setState(
                {
                    token: tokenBalances[0].map_token_name + '-' + tokenBalances[0].map_token_id + '-TRC10',
                },
                () => this.getSelectedTokenBalance())

        }
        // else if (!token && tokens20.length > 0 && tokenBalances.length === 0) {
        //     this.setState(
        //         {
        //             token: tokens20[0].name + '-TRC20',
        //         },
        //         () => this.getSelectedTokenBalance())
        // }
    }

    handleTokenChange = (value) => {
        this.setState({ token: value },() =>{
            this.getSelectedTokenBalance();
        });
    }

    tokenBalanceSelect = () => {
        let {tokenBalanceSelectChange} = this.props;
        let { token, decimals, balance } = this.state;
        let list = token.split('-');
        let TokenName =  list[1];
        tokenBalanceSelectChange && tokenBalanceSelectChange(TokenName, decimals, balance);
    };



    getSelectedTokenBalance = () => {
        let {tokenBalances,tokens20} = this.props;
        let {token} = this.state;
        let TokenType =  token.substr(token.length-5,5);
        let list = token.split('-')
        if (token && TokenType == 'TRC10') {
            let TokenName =  list[1];
            let balance = parseFloat(find(tokenBalances, t => t.map_token_id === TokenName).map_amount);
            let TokenDecimals = parseFloat(find(tokenBalances, t => t.map_token_id === TokenName).map_token_precision);
            if(TokenName == 'TRX'){
                this.setState({
                    decimals: 6,
                    balance:balance
                },() =>{
                    this.tokenBalanceSelect();
                })
            }else{
                this.setState({
                    decimals: TokenDecimals,
                    balance:balance
                },() =>{
                    this.tokenBalanceSelect();
                })
            }
        }
        // else if(token && TokenType == 'TRC20'){
        //     let TokenName =  list[0];
        //     let balance = parseFloat(find(tokens20, t => t.name === TokenName).token20_balance_decimals);
        //     let TokenDecimals = parseFloat(find(tokens20, t => t.name === TokenName).decimals);
        //     this.setState({
        //         decimals: TokenDecimals,
        //         balance:balance
        //     })
        // }

        return 0;
    };



    render() {
        let { token} = this.state;
        let { tokenBalances, tokens20, intl, className = '' } = this.props;
        tokenBalances = _(tokenBalances)
            .filter(tb => tb.balance > 0)
            .filter(tb => tb.map_token_id > 0 || tb.map_token_id == '_')
            .value();
        tokenBalances.map(item =>{
            item.token_name_type = item.map_token_name + '-' + item.map_token_id + '-TRC10';
            return item
        });
        tokens20 && tokens20.map(item =>{
            item.token_name_type =  item.name + '-TRC20';
            return item
        });
        return (
            <Select
                onChange={this.handleTokenChange}
                className={className}
                value={token}
            >
                <OptGroup label={tu('TRC10_token')} key="TRC10">
                    {
                        tokenBalances.map((tokenBalance, index) => (
                            <Option value={tokenBalance.token_name_type} key={index}>
                        <span> {tokenBalance.map_token_name}
                            {
                                tokenBalance.map_token_id !== '_'?
                                    <span style={{fontSize:12,color:'#999',margin:'2px 4px 8px'}}>[ID:{tokenBalance.map_token_id}]</span>
                                    :""
                            }
                            ({tokenBalance.map_amount} {intl.formatMessage({id: "available"})})</span>

                            </Option>
                        ))
                    }
                </OptGroup>
                {/*<OptGroup label={tu('TRC20_token')} key="TRC20">*/}
                    {/*{*/}
                        {/*tokens20.map((token, index) => (*/}
                            {/*<Option value={token.token_name_type} key={index}>*/}
                                {/*/!*<span>{token.name}</span>*!/*/}
                                {/*/!*({token.token20_balance} {intl.formatMessage({id: "available"})})*!/*/}
                                {/*{token.name} ({token.token20_balance_decimals} {intl.formatMessage({id: "available"})})*/}
                            {/*</Option>*/}
                        {/*))*/}
                    {/*}*/}
                {/*</OptGroup>*/}
            </Select>
        )
    }
}


function mapStateToProps(state) {
    return {
        account: state.app.account,
        wallet: state.app.wallet,
        tokenBalances: state.account.tokens,
        tokens20: state.account.tokens20,
    };
}

const mapDispatchToProps = {
    reloadWallet
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TokenBalanceSelect))