import React,{Component}  from "react";
import {RecaptchaAsync} from "../common/async";
//import {FormattedNumber} from "react-intl";
//import {Alert} from "reactstrap";

class TestNetRequest extends Component {
    constructor() {
        super();
        this.state = {
            modal: null,
            verificationCode: null,
            waitingForTrx: false,
        };
    }

    onVerify = (code) => {
        this.setState({
            verificationCode: code,
        });
        this.props.handleCaptchaCode(code);
    };

    onExpired = () => {
        this.setState({
            verificationCode: null,
        });
    };

    onLoad = (args) => {

    };

    requestTrx = async () => {
        // let {account, onRequested} = this.props;
        // let {verificationCode} = this.state;
        //
        // this.setState({waitingForTrx: true});
        //
        // try {
        //
        //     let address = account.address;
        //
        //     let {data} = await xhr.post(`${API_URL}/api/testnet/request-coins`, {
        //         address,
        //         captchaCode: verificationCode,
        //     });
        //
        //     let {success, message, code, amount} = data;
        //
        //     if (success) {
        //         this.setState({
        //             success: true,
        //             modal: (
        //                 <SweetAlert success title={tu("trx_received")} onConfirm={this.hideModal}>
        //                     <FormattedNumber value={amount / ONE_TRX}/> TRX {tu("have_been_added_to_your_account")}
        //                 </SweetAlert>
        //             )
        //         });
        //     } else if (code === "CONTRACT_VALIDATE_ERROR") {
        //         this.setState({
        //             verificationCode: null,
        //             modal: (
        //                 <SweetAlert danger title={tu("error")} onConfirm={this.hideModal}>
        //                     {tu("test_trx_temporarily_unavailable_message")}
        //                 </SweetAlert>
        //             )
        //         });
        //     } else {
        //         this.setState({
        //             verificationCode: null,
        //             modal: (
        //                 <SweetAlert danger title="Error" onConfirm={this.hideModal}>
        //                     {message}
        //                 </SweetAlert>
        //             )
        //         });
        //     }
        //
        //     onRequested && onRequested();
        //
        // } catch (e) {
        //     this.setState({
        //         verificationCode: null,
        //         modal: (
        //             <SweetAlert danger title="TRX Received" onConfirm={this.hideModal}>
        //                 {tu("An_unknown_error_occurred,_please_try_again_in_a_few_minutes")}
        //             </SweetAlert>
        //         )
        //     });
        // }
        // finally {
        //     this.setState({
        //         waitingForTrx: false,
        //     });
        // }
    };

    // canRequest = () => {
    //     let {verificationCode, waitingForTrx} = this.state;
    //     return !waitingForTrx && !!verificationCode;
    // };

    canRequest = () => {
        let {verificationCode } = this.state;
        return   verificationCode
    };

    render() {
        return (
            <React.Fragment>
                <div className="d-flex justify-content-center">
                    <RecaptchaAsync
                        sitekey="6LejYqQUAAAAADMEfCJkRyZdvzxtqdX5-83yUUjH"
                        render="explicit"
                        onloadCallback={this.onLoad}
                        expiredCallback={this.onExpired}
                        verifyCallback={this.onVerify}/>
                </div>
                {/*<button className="btn btn-secondary"*/}
                        {/*onClick={this.requestTrx}*/}
                        {/*disabled={!this.canRequest()}>*/}
                    {/*{tu("request_trx_for_testing")}*/}
                {/*</button>*/}
                {/*<button type="button"*/}
                        {/*className="btn btn-lg btn-verify text-capitalize mt-3 mb-4"*/}
                        {/*onClick={this.requestTrx}*/}
                        {/*disabled={!this.canRequest()}>{tu('verify_and_publish')}</button>*/}
                {/*<button type="button" className="btn btn-lg ml-3 btn-reset text-capitalize  mt-3 mb-4">{tu('reset')}</button>*/}
            </React.Fragment>
        )
    }
}

export default TestNetRequest