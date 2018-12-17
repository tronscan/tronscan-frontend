import React, {Component} from 'react';
import {injectIntl} from "react-intl";
import TokenInfo from './components/common/tokeninfo'


class trxMarket extends Component{

    render(){
        return (
            <main className="container header-overlap">
                <TokenInfo></TokenInfo>   
            </main>
        )
    }
}

export default injectIntl(trxMarket);