/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import React from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {tu, t} from "../../../utils/i18n";
import {FormattedNumber} from "react-intl";
import { Switch } from 'antd';


@injectIntl
export default class FreezeBalanceModal extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            optimizer:1,
            resources: [
                {
                    label:"solidity-0.4.25_Odyssey_v3.2.3",
                    value:"solidity-0.4.25_Odyssey_v3.2.3"
                }
            ],
            hideSmallCurrency: true,
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
        let {amount} = this.state;
        onConfirm && onConfirm({
            amount
        });
    };

    resourceSelectChange = (value) => {
        this.setState({
            selectedResource: value
        });
    };

    handleToggle = (prop) => {
        return (enable) => {
            this.setState({ [prop]: enable });
            //this.props.handleSwitch(enable);
        };
    }


    render() {
        let {resources, selectedResource,hideSmallCurrency} = this.state;
        let {trxBalance, frozenTrx, intl} = this.props;
        return (
            <Modal isOpen={true} toggle={this.hideModal} fade={false} className="modal-dialog-centered _freezeContent">
                <ModalHeader className="text-center _freezeHeader" toggle={this.hideModal}>
                    {tu("Compile Params")}
                </ModalHeader>
                <ModalBody className="text-center _freezeBody">
                    <div className="form-group">
                        <label>{tu("Solidity Version")}</label>
                        <select className="custom-select"
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
                    <div className="form-group">
                        <label>{tu("Optimization")}</label>
                        <Switch checked={hideSmallCurrency} onChange={this.handleToggle('hideSmallCurrency')} />
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
