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
export default class CompilerJsonInfo extends React.PureComponent {

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
        let { showModal } = this.state;
        let { title, json } = this.props;
        let jsonObj = JSON.parse(json);
        if( typeof jsonObj == 'string' && jsonObj.length >100 ){
            jsonObj = jsonObj.substr(0, 100) + '...'
        }
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
                                    <JSONTree data={jsonObj} theme={theme} invertTheme={true}/>:
                                    <ReactJson src={jsonObj} theme="summerfruit:inverted" iconStyle="square" name={false} displayDataTypes={false}/>
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
                                    {tu("compile_close")}
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
    scheme: 'summerfruit',
    author: 'christopher corley (http://cscorley.github.io/)',
    base00: '#151515',
    base01: '#202020',
    base02: '#303030',
    base03: '#505050',
    base04: '#B0B0B0',
    base05: '#D0D0D0',
    base06: '#E0E0E0',
    base07: '#FFFFFF',
    base08: '#FF0086',
    base09: '#FD8900',
    base0A: '#ABA800',
    base0B: '#00C918',
    base0C: '#1faaaa',
    base0D: '#3777E6',
    base0E: '#AD00A1',
    base0F: '#cc6633'
};

