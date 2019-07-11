/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import React from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {tu, t} from "../../../utils/i18n";
import {FormattedNumber} from "react-intl";
import { Switch } from 'antd';


@injectIntl
export default class CompilerModal extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            resources: [
                {
                    label:"solidity-0.4.25_Odyssey_v3.2.3",
                    value:"solidity-0.4.25_Odyssey_v3.2.3"
                }
            ],
            runs:[
                {
                    label:"0",
                    value:"0"
                },
                {
                    label:"200",
                    value:"200",
                }
            ],
            selectedResource:'solidity-0.4.25_Odyssey_v3.2.3',
            hideSmallCurrency: true,
            optimizer:'1',
            selectedRuns:"0",
        };
    }

    componentDidMount() {

    }

    hideModal = () => {
        let {onHide} = this.props;
        onHide && onHide();
    };

    confirmModal = () => {
        let {onConfirm} = this.props;
        let { optimizer, selectedResource, selectedRuns } = this.state;
        onConfirm && onConfirm(selectedResource, optimizer, selectedRuns);
    };

    resourceSelectChange = (value) => {
        this.setState({
            selectedResource: value
        });
    };

    runsSelectChange = (value) => {
        this.setState({
            selectedRuns: value
        });
    };

    handleToggle = (prop) => {
        let {onOptimizerMsg} = this.props;
        return (enable) => {
            console.log('enable',enable)
            this.setState({
                [prop]: enable,
                'optimizer':enable?'1':'0'
            });
        };
    }






    render() {
        let {resources, selectedResource, hideSmallCurrency, runs, selectedRuns} = this.state;
        let {trxBalance, frozenTrx, intl} = this.props;
        return (
            <Modal isOpen={true} toggle={this.hideModal} fade={false} className="modal-dialog-centered _freezeContent">
                <ModalHeader className="text-center _freezeHeader" toggle={this.hideModal}>
                    {tu("contract_compile_params")}
                </ModalHeader>
                <ModalBody className="text-center _freezeBody">
                    <div className="form-group d-flex p-3 justify-content-between">
                        <label>{tu("compile_params_version")}</label>
                        <select className="custom-select compile-select"
                                value={selectedResource}
                                onChange={(e) => {this.resourceSelectChange(e.target.value)}}>
                                {
                                    resources.map((resource, index) => {
                                        return (
                                            <option key={index} value={resource.value}>{intl.formatMessage({id: resource.label})}</option>
                                        )
                                    })
                                }
                        </select>
                    </div>
                    <div className="form-group d-flex p-3 justify-content-between">
                        <label>{tu("compile_params_runs")}</label>
                        <select className="custom-select compile-select"
                                value={selectedRuns}
                                onChange={(e) => {this.runsSelectChange(e.target.value)}}>
                                {
                                    runs.map((run, index) => {
                                        return (
                                            <option key={index} value={run.value}>{intl.formatMessage({id: run.label})}</option>
                                        )
                                    })
                                }
                        </select>
                    </div>
                    <div className="form-group d-flex pl-3 pr-3 pb-3">
                        <label>{tu("compile_params_optimization")}</label>
                        <div className="compile-switch">
                            <Switch checked={hideSmallCurrency} onChange={this.handleToggle('hideSmallCurrency')} />
                        </div>
                    </div>
                    <div className="contract-compiler-button mt-3 mb-3">
                        <button
                            onClick={this.hideModal}
                            className="compile-button-small cancel"
                        >
                            {tu('cancel')}
                        </button>
                        <button
                            onClick={this.confirmModal}
                            className="compile-button-small ml-5"
                        >
                            {tu('confirm')}
                        </button>
                    </div>
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
