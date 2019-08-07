import React, {Component} from 'react';
import {tu} from "../utils/i18n";
import {FormattedNumber, injectIntl} from "react-intl";

class Error extends Component {

    constructor() {
        super();

        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {

        let { intl } = this.props;
        return (
            <main className="container header-overlap pb-3 token_black">
                <div className="row d-flex" style={{color:'#C23631','fontSize':'50px'}}>
                    404
                </div>
            </main>
        )
    }
}


export default injectIntl(Error)
