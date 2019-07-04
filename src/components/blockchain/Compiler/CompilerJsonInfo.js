/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import React from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {tu, t} from "../../utils/i18n";
import {FormattedNumber} from "react-intl";
import {Client} from "../../services/api";
import {ONE_TRX} from "../../constants";
import {reloadWallet} from "../../actions/wallet";
import {NumberField} from "../common/Fields";
import {transactionResultManager} from "../../utils/tron";
import Lockr from "lockr";
import {withTronWeb} from "../../utils/tronWeb";

@connect(
    state => ({
        account: state.app.account,
        wallet: state.app.wallet,
        tokenBalances: state.account.tokens,
        trxBalance: state.account.trxBalance || state.account.balance,
    }),
    {
        reloadWallet
    }
)
@injectIntl
@withTronWeb
export default class FreezeBalanceModal extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            confirmed: false,
        };
    }

    componentDidMount() {
        this.props.reloadWallet();
    }

    hideModal = () => {
        let {onHide} = this.props;
        onHide && onHide();
    };

    confirmModal = () => {
        let {onConfirm} = this.props;
        let {amount} = this.state;
        onConfirm && onConfirm({
            amount
        });
    };

    render() {
        let {confirmed} = this.state;


        return (
            <Modal isOpen={true} toggle={this.hideModal} fade={false} className="modal-dialog-centered _freezeContent">
                <ModalHeader className="text-center _freezeHeader" toggle={this.hideModal}>
                    {tu("freeze")}
                </ModalHeader>
                <ModalBody className="text-center">

                    <p className="mt-3">
                        <button className="btn btn-primary col-sm"
                                disabled={!isValid}
                                onClick={this.freeze}
                                style={{background: '#4A90E2', borderRadius: '0px', border: '0px'}}
                        >
                            <i className="fa fa-snowflake mr-2"/>
                            {tu("freeze")}
                        </button>
                    </p>
                </ModalBody>
            </Modal>
        )
    }
}

const styles = {
    maxButton: {
        position:'absolute',
        right:0,
        top:0,
        background:'none',
        height:'35px',
        border:'none',
        cursor:'pointer',
    }
};
