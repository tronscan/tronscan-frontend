import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../../utils/i18n";
import {connect} from "react-redux";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import 'moment/min/locales';
import ContractCodeRequest from "../../tools/ContractCodeRequest";
import {
    Form, Row, Col, Input, Button, Icon,
} from 'antd';

const { TextArea } = Input;

export class resultInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...this.props.state,
        };
    }

    componentDidMount() {}

    againInput = () => {
        let res = '';
        let errorInfo = ''
        this.setState({
            res,
            errorInfo
        },() => {
            this.props.nextState({res, errorInfo})
            this.props.nextStep(1)
        });
    }

    goToProposalsList = () => {
        window.location.hash = "#/proposals";
    }

    render() {
        let { intl } = this.props;
        let { res } = this.state;
        return (
            <main className="token-result pb-lg-5">
                {
                    !res? <div className="result-failure">
                        <img src={require("../../../images/token/result_failure.png")} alt=""/>
                        <h5 className="proposal-created-status">{tu('proposal_created_failure')}</h5>
                        {/* <div className="mt-3 d-flex failure-reason">
                            {
                                errorInfo &&  <div className="d-flex">
                                    <span>{tu('token_input_failure_reason')}</span>
                                    <div>
                                        {
                                            (type == 'trc20' && errorInfo)|| (isUpdate && errorInfo)?errorInfo.map((item,index) => {
                                                    return <p key={index}>{index +1 }. {tu(this.setErrorMsg(item))}</p>
                                                }):
                                                <p>{errorInfo ? <span>1.{errorInfo}</span>:'' }</p>
                                        }

                                    </div>
                                </div>
                            }
                        </div> */}
                        {/* <div className="d-flex mt-3">
                            <button className="btn btn-danger btn-lg" onClick={this.goToProposalsList}>{tu('go_to_proposals_list')}</button>
                            <button className="ml-4 btn btn-danger btn-lg" onClick={this.againInput}>{tu('token_input_failure_submit')}</button>
                        </div> */}
                    </div>
                    :
                    <div className="result-success">
                        <img src={require("../../../images/token/result_success.png")} alt=""/>
                        <h5 className="proposal-created-status">{tu('proposal_created_successful')}</h5>
                        {/* <p className="mytoken result-success-info">
                            {tu('token_input_success_you_can')}
                            <span className="mytoken-wallet">{tu('token_input_success_wallet')}</span>
                            ->
                            <span className="mytoken-wallet">{tu('token_input_success_myaccount')}</span>
                            <span>{tu('token_input_success_find_it')}</span>
                        </p> */}
                        {/*<p className="result-success-info">*/}
                            {/*{tu('token_input_success_tip')}*/}
                        {/*</p>*/}
                        {/*<p className="mt-4 submit-market">*/}
                            {/*{tu('token_input_success_trx_market')}*/}
                        {/*</p>*/}
                        <div className="d-flex mt-3">
                            <button className="btn btn-danger btn-lg" onClick={this.goToProposalsList}>{tu('go_to_proposals_list')}</button>
                            {/* <button className="ml-4 btn btn-danger btn-lg" onClick={this.againInput}>{tu('token_input_failure_submit')}</button> */}
                        </div>
                    </div>
                }


            </main>
        )
    }
}


export default injectIntl(resultInfo);
