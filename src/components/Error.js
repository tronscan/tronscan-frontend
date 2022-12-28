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
            <main className="container pb-3 token_black">
                <div className="row d-flex error-info">
                    <img src={require('../images/home/error.png')}/>
                    <div className="d-flex flex-column error-info-box">
                        <div className="error-info-404">404</div>
                        <div className="error-info-font">
                            The page you visited does not exist
                        </div>
                    </div>

                </div>
            </main>
        )
    }
}


export default injectIntl(Error)
