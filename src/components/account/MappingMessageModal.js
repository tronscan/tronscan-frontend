import React, { Component } from 'react';
import { connect } from 'react-redux';
import { tu } from '../../utils/i18n';
import { Modal } from 'antd';

class MappingMessageModal extends Component {

    /**
     * Modal cancel
     */
    cancel = () => {
        const { onCancel } = this.props;
        onCancel && onCancel();
    };

    render() {
        return (
            <Modal
                title={tu('sidechain_account_pledge_btn')}
                visible={true}
                onCancel={this.cancel}
                footer={null}
            >
                <p>{tu('pledge_mapping_text')}</p>
                <p className="mt-5 text-center">
                    <button className="btn btn-danger" style={{ width: '20%' }}
                        onClick={this.cancel}>{tu('ok_confirm')}</button>
                </p>
            </Modal>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MappingMessageModal);