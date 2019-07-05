/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import React from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {tu, t} from "../../../utils/i18n";
import {FormattedNumber} from "react-intl";
import JSONTree from 'react-json-tree'

@connect(
    state => ({
        account: state.app.account,
        wallet: state.app.wallet,
        tokenBalances: state.account.tokens,
        trxBalance: state.account.trxBalance || state.account.balance,
    }),
)
@injectIntl
export default class FreezeBalanceModal extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            confirmed: false,
    };
    }

    componentDidMount() {

    }
    showInfoModal = () => {
        let {onShow} = this.props;
        onShow && onShow();
    }

    hideInfoModal = () => {
        let {onHide} = this.props;
        onHide && onHide();
    };

    confirmModal = () => {
        let {onConfirm} = this.props;


    };




    render() {
        let { theme } = this.state;
        let { title, json, showModal} = this.props;
        return (
            <div className="contract-compiler-console-info">
                <span className="info-btn" onClick={this.showInfoModal} >{title}</span>
                {
                    showModal?<Modal isOpen={true} toggle={this.hideModal} fade={false} className="modal-dialog-centered _freezeContent">
                        <ModalHeader className="text-center _freezeHeader" toggle={this.hideInfoModal}>
                            {title}
                        </ModalHeader>
                        <ModalBody className="text-center _freezeBody">
                            <div>
                                <JSONTree data={json} theme={theme} invertTheme={false} />
                            </div>
                            <p className="mt-3">
                                <button className="btn btn-primary col-sm"
                                        style={{background: '#4A90E2', borderRadius: '0px', border: '0px'}}
                                >
                                    <i className="fa fa-snowflake mr-2"/>
                                    {tu("freeze")}
                                </button>
                            </p>
                        </ModalBody>
                    </Modal>:''
                }

            </div>

        )
    }
}

const theme = {
    scheme: 'monokai',
    author: 'wimer hazenberg (http://www.monokai.nl)',
    base00: '#272822',
    base01: '#383830',
    base02: '#49483e',
    base03: '#75715e',
    base04: '#a59f85',
    base05: '#f8f8f2',
    base06: '#f5f4f1',
    base07: '#f9f8f5',
    base08: '#f92672',
    base09: '#fd971f',
    base0A: '#f4bf75',
    base0B: '#a6e22e',
    base0C: '#a1efe4',
    base0D: '#66d9ef',
    base0E: '#ae81ff',
    base0F: '#cc6633'
};