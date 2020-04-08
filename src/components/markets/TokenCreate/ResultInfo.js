import React, { Component } from 'react';
import { tu } from '../../../utils/i18n';
import { injectIntl } from 'react-intl';
import 'moment/min/locales';
import { MARKET_HTTP_URL} from '../../../constants';


export class resultInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...this.props.state,
        };
    }

    componentDidMount() {
        this.props.nextState({ leave_lock: true });
    }

    againInput = () => {
        this.setState({
            mes: '',
            id: null
        },() => {
            this.props.nextState({ mes: '', id: null });
            this.props.nextStep(0);
        });
    }

    /**
     * to account
     */
    toAccount = () => {
        this.props.history.push('/account')
    }

    /**
     * to Poloni DEX trading
     */
    toTrading = () => {
        window.open(MARKET_HTTP_URL)
    }

    /**
     * Continue to enter
     */
    submit = () => {
        const { id, tokenId } = this.state;
        this.props.history.push(`/tokens/markets/add/team/${tokenId}/${id}`);
    }

    render() {
        let { id, msg } = this.state;

        // error item
        const errorItem = (
            <div className="result-failure">
                <img src={require('../../../images/token/result_failure.png')} alt=""/>
                <h5>{tu('token_input_failure')}</h5>
                <div className="mt-3 d-flex failure-reason">
                    {
                        !id && <div className="d-flex">
                            <span>{tu('token_input_failure_reason')}</span>
                            <div>
                                <p><span>{msg}</span></p>
                            </div>
                        </div>
                    }
                </div>
                <div className="d-flex mt-3">
                    <button className="btn btn-default btn-lg"
                        onClick={this.toAccount}>{tu('token_input_failure_no_submit')}</button>
                    <button className="ml-4 btn btn-danger btn-lg"
                        onClick={this.againInput}>{tu('token_input_failure_submit')}</button>
                </div>
            </div>
        );

        // success item
        const successItem = (
            <div className="result-success">
                <img src={require('../../../images/token/result_success.png')} alt=""/>
                <p className="mytoken result-success-info pt-5">
                    {tu('market_enter_success')}，
                    {tu('token_input_success_you_can')}
                    <span className="color-red pl-1 pr-1">Poloni DEX</span>
                    <span>{tu('search_trading')}</span>
                </p>
                <button className="ml-4 btn btn-danger" htmltype="submit"
                    onClick={this.toTrading}>{tu('to_trading')}</button>
                <p className="mt-4 submit-market">
                    {tu('trading_list_info')}
                </p>
                <button className="ml-4 btn btn-danger" htmltype="submit"
                    onClick={this.submit}>{tu('continue_enter')}</button>
            </div>
        );
        return (
            <main className="token-result">
                {!!id ? successItem : errorItem}
            </main>
        );
    }
}

export default injectIntl(resultInfo);
