/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import React from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {tu, t} from "../../../utils/i18n";
import {FormattedNumber} from "react-intl";
import { Switch, Select } from 'antd';
const { Option } = Select;

@injectIntl
export default class CompilerModal extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            resources: [
                {
                    label:"0.4.25_Odyssey_v3.2.3",
                    value:"tron-0.4.25_Odyssey_v3.2.3"
                },
                {
                    label:"0.5.8_Odyssey_v3.6.0",
                    value:"tron-0.5.8_Odyssey_v3.6.0"
                },
                {
                    label:"0.5.4_Odyssey_v3.6.0",
                    value:"tron-0.5.4_Odyssey_v3.6.0"
                },
                {
                    label:"tron-0.4.24",
                    value:"tron-0.4.24"
                },
                {
                    label:"0.5.9_Odyssey_v3.6.5",
                    value:"tron-0.5.9_Odyssey_v3.6.5"
                },
                {
                    label:"0.5.10_Odyssey_v3.6.6",
                    value:"tron-0.5.10_Odyssey_v3.6.6"
                },
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
            selectedResource:'tron-0.4.25_Odyssey_v3.2.3',
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
            this.setState({
                [prop]: enable,
                'optimizer':enable?'1':'0',
                selectedRuns: enable ? this.state.selectedRuns : '0'
            });
        };
    }






    render() {
        let {resources, selectedResource, hideSmallCurrency, runs, selectedRuns} = this.state;
        let {trxBalance, frozenTrx, intl} = this.props;
        return (
            <Modal isOpen={true} fade={false} className="modal-dialog-centered _freezeContent">
                <ModalHeader className="text-center _freezeHeader" toggle={this.hideModal}>
                    {tu("contract_compile_params")}
                </ModalHeader>
                <ModalBody className="text-center _freezeBody">
                    <div className="d-flex p-2 justify-content-between">
                        <label>{tu("compile_params_version")}</label>
                        <Select className='compile-select'
                                value={selectedResource}
                                onChange={this.resourceSelectChange}
                        >
                            {
                                resources.map((resource, index) => {
                                    return (
                                        <Option key={index} value={resource.value}>{resource.label}</Option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                    <div className="d-flex p-2">
                        <label>{tu("compile_params_optimization")}</label>
                        <div className="compile-switch">
                            <Switch checked={hideSmallCurrency} onChange={this.handleToggle('hideSmallCurrency')} />
                        </div>
                    </div>
                    <div className="d-flex p-2 justify-content-between">
                        <label>{tu("compile_params_runs")}</label>
                        <Select className='compile-select'
                                value={selectedRuns}
                                onChange={this.runsSelectChange}
                                disabled={!hideSmallCurrency}
                        >
                            {
                                runs.map((run, index) => {
                                    return (
                                        <Option key={index} value={run.value}>{run.label}</Option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                    
                    <div className="contract-compiler-button-modal mt-3 mb-2">
                        {/*<button*/}
                            {/*onClick={this.hideModal}*/}
                            {/*className="compile-button-small cancel"*/}
                        {/*>*/}
                            {/*{tu('cancel')}*/}
                        {/*</button>*/}
                        <button
                            onClick={this.confirmModal}
                            className="compile-button-large"
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
