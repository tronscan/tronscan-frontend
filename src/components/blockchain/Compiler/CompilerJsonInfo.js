/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import React from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {tu, t} from "../../../utils/i18n";
import {FormattedNumber} from "react-intl";
import ReactJson from 'react-json-view'
import JSONTree from 'react-json-tree'
import {CopyToClipboard} from "react-copy-to-clipboard";

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
            showModal:false
    };
    }

    componentDidMount() {

    }
    showInfoModal = () => {
        this.setState({
            showModal: true,
        });
    }

    hideInfoModal = () => {
        this.setState({
            showModal: false,
        });
    };

    confirmModal = () => {
        let {onConfirm} = this.props;


    };




    render() {
        let { theme,showModal } = this.state;
        let { title, json } = this.props;
        let jsonObj = JSON.parse(json);
        return (
            <div className="contract-compiler-console-info">
                <span className="info-btn" onClick={this.showInfoModal} >{title}</span>
                {
                    showModal? <Modal isOpen={true} toggle={this.hideInfoModal} fade={false} className="modal-dialog-centered contract-compiler-modal-content" >
                        <ModalHeader className="text-center _freezeHeader" toggle={this.hideInfoModal}>
                            {title}
                        </ModalHeader>
                        <ModalBody className="_freezeBody">
                            <div>
                                {
                                    typeof jsonObj == 'string'?
                                    <JSONTree data={jsonObj} theme={theme} invertTheme={false} />:
                                    <ReactJson src={jsonObj}  theme="summerfruit:inverted" iconStyle="square" name={false} displayDataTypes={false}/>
                                }

                            </div>
                            <div className="mt-3 compile-modal-btn">
                                <CopyToClipboard text={json}>
                                    <button className="btn btn-primary col-sm"
                                            style={{background: '#4A90E2', borderRadius: '2px', border: '0px'}}
                                    >
                                        {tu("Copy")}
                                    </button>
                                </CopyToClipboard>

                                <button className="btn btn-primary col-sm ml-4"
                                        style={{background: '#C23631', borderRadius: '2px', border: '0px'}}
                                        onClick={this.hideInfoModal}
                                >
                                    {tu("Close")}
                                </button>
                            </div>
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