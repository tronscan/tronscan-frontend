import React, {Component} from 'react';
import {connect} from "react-redux";
import {tu} from "../../utils/i18n";
import {Modal, ModalBody, ModalHeader} from "reactstrap";

class OperateTxnPairModal extends Component {

    constructor() {
        super();

        this.state = {
            name: "",
            disabled: false,
        };
    }

    isValid = () => {
        let {name} = this.state;

        if (name.length < 8) {
            return [false, tu("name_to_short")]
        }

        if (name.length > 32) {
            return [false, tu("name_to_long")];
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
            return [false, tu("permitted_characters_message")];
        }

        return [true];
    };

    hideModal = () => {
        this.setState({
            modal: null,
        });
    };

    confirm = () => {
        let {onConfirm} = this.props;
        let {name} = this.state;
        onConfirm && onConfirm(name);
        this.setState({disabled: true});
    };

    cancel = () => {
        let {onCancel} = this.props;
        onCancel && onCancel();
    };

    render() {

        let {modal, name, disabled} = this.state;

        let [isValid, errorMessage] = this.isValid();

        if (modal) {
            return modal;
        }

        return (
            <Modal isOpen={true} toggle={this.cancel} fade={false} size="md" className="modal-dialog-centered">
                <ModalHeader className="text-center" toggle={this.cancel}>
                    {/*<i className="fa fa-plus-square"></i>*/}
                    {/*&nbsp;*/}
                    {/*{tu("创建交易对")}*/}
                </ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-12">
                            <label>{tu("选择您想要注资的通证：")}</label>
                            <select className="custom-select"
                                //value={selectedResource}
                                // onChange={(e) => {this.resourceSelectChange(e.target.value)}}
                            >
                            </select>
                            <div className="invalid-feedback text-center text-danger">
                                {errorMessage}
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-12">
                            <label>{tu("注资金额")}</label>
                            <input className={"form-control" + ((name.length !== 0 && !isValid) ? " is-invalid" : "")}
                                   type="text"
                                   placeholder="Account Name"
                                   value={name}
                                   onChange={(ev) => this.setState({name: ev.target.value})}/>
                            <div className="invalid-feedback text-center text-danger">
                                {errorMessage}
                            </div>
                        </div>
                    </div>
                    <div className="pt-4">
                        <p className="text-center">
                            <button
                                // disabled={disabled || !isValid}
                                className="btn btn-danger"
                                style={{width:'100%'}}
                                onClick={this.confirm}>{tu("创建")}</button>
                        </p>
                    </div>
                </ModalBody>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(OperateTxnPairModal)
