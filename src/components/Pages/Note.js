/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import React from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {tu, t} from "../../utils/i18n";
import {FormattedNumber} from "react-intl";
import {reloadWallet} from "../../actions/wallet";
import {withTronWeb} from "../../utils/tronWeb";
import { Tooltip } from 'antd';
import {upperFirst} from "lodash";
import {HrefLink} from "../common/Links";
import SmartTable from "../common/SmartTable.js"
@connect(
    state => ({
        account: state.app.account,
        wallet: state.app.wallet,
        tokenBalances: state.account.tokens,
        trxBalance: state.account.trxBalance || state.account.balance
    }),
    {
        reloadWallet
    }
)
@injectIntl
@withTronWeb
export default class NoteModal extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    componentDidMount() {


    }

    hideModal = () => {
        let {onHide} = this.props;
        onHide && onHide();
    };
    customizedColumn = () => {
        let {intl} = this.props;
        let column = [
            {
                title: upperFirst(intl.formatMessage({id: 'propose_number'})),
                dataIndex: 'index',
                align: 'left',
                render: (text, record, index) => {
                    return <div>{index+1}</div>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'developers_contribution_link'})),
                dataIndex: 'address',
                key: 'address',
                align: 'left',
                className: 'ant_table',
                width: '80%',
                render: (text, record, index) => {
                    return <HrefLink href={record.url} target="_blank" className="text-muted">
                           <span style={{'wordBreak': 'break-all'}}>{record.url}</span>
                    </HrefLink>
                }
            },

            {
                title: upperFirst(intl.formatMessage({id: 'developers_earn_points'})),
                dataIndex: 'balance',
                key: 'supply',
                align: 'left',
                className: 'ant_table',
                // width: '12%',
                render: (text, record, index) => {
                    return <div><FormattedNumber value={record.points}/></div>
                }
            },
        ];
        return column;
    }


    render() {

        let { loading } = this.state;
        let { intl,notes } = this.props;
        let total = notes.length;
        let column = this.customizedColumn();
        return (
            <Modal isOpen={true} toggle={this.hideModal} fade={false} className="modal-dialog-centered _freezeContent developers_note">
                <ModalHeader className="text-center _freezeHeader" toggle={this.hideModal}>
                    {tu("developers_points_details")}
                </ModalHeader>
                <ModalBody className="text-center _freezeBody token_black">
                    <SmartTable bordered={true} loading={loading} column={column} data={notes} total={total} position='bottom'/>
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
