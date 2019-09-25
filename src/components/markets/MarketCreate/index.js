import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { tu } from './../../../utils/i18n';
import TokenInfo from './TokenInfo';
import TeamInfo from './TeamInfo';
import OtherInfo from './OtherInfo';
import { Form } from 'antd';
import { Client } from './../../../services/api';
import moment from 'moment';
import SweetAlert from 'react-bootstrap-sweetalert';
import { MARKETPAGE, API_URL } from './../../../constants';
import xhr from 'axios/index';

@connect(
    (state, ownProp) => ({
        account: state.app.account,
        wallet: state.wallet.current,
        page: ownProp.match.params.page,
        id: ownProp.match.params.id,
    })
)

export class MarketCreate extends Component {

    static propTypes = {
        id: PropTypes.string.isRequired,
        page: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            params: {
            },
        };
    }

    componentDidMount() {
    }

    showModal = (msg) => {
        let { intl } = this.props;
        this.setState({
            modal: <SweetAlert
                error
                confirmBtnText={intl.formatMessage({ id: 'confirm' })}
                confirmBtnBsStyle="success"
                onConfirm={this.hideModal}
                style={{ marginLeft: '-240px', marginTop: '-195px' }}
            >
                {tu(msg)}
            </SweetAlert>
        }
        );
    }

    hideModal = () => {
        this.setState({
            modal: null,
        });
    };

    prevStep = () => {
        const { step } = this.state;
        let newStep = step;
        switch (step) {
            case 1:
            case 2:
                newStep -= 1;
                break;
            case 0:
            default:
                break;
        }

        this.setState({
            step: newStep,
        });
    };

    submit = (e) => {
        const { page, form: { validateFields, getFieldsValue }, history } = this.props;
        const { step, params } = this.state;
        const values = getFieldsValue();

        let newParams = params;
        let newStep = step;
        switch (step) {
            case 1:
                validateFields((err, values) => {
                    newParams = Object.assign({}, values);
                    newStep += 1;
                });
                break;
            case 2:

                break;
            case 0:
            default:
                validateFields((err, values) => {
                    const tokenInformation = {

                    };
                    const saleInformatiom = {

                    };
                    newParams = Object.assign({}, values);
                    newStep += 1;
                });
                break;
        }

        this.setState({
            step: newStep,
            params: newParams,
        });
    }

    /**
     * get page
     */
    getPage = () => {
        const { form } = this.props;
        const { step, params } = this.state;
        switch (step) {
            case 1:
                return <TeamInfo form={form} params={params} />;
            case 2:
                return <OtherInfo form={form} params={params} />;
            case 0:
            default:
                return <TokenInfo form={form} params={params} />;
        }
    }

    additionalInfo = async() => {
        const { params } = this.state;
        //
        const { data } = await xhr.post(`${API_URL}/api/solidity/contract/verify`, params);
    }

    render() {
        const { modal } = this.state;
        return (
            <main className="container pb-4 mb-4 token-create header-overlap tokencreated token_black bg-white"
                style={{ marginTop: '-40px' }}>
                {modal}
                <Form
                    className="ant-advanced-search-form"
                >
                    {this.getPage()}
                    <div className="text-right px-2">
                        {<a className="btn btn-default btn-lg" onClick={this.prevStep}>{tu('sign_out')}</a>}
                        <button className="ml-4 btn btn-danger btn-lg" onClick={this.submit}>{tu('next')}</button>
                    </div>
                </Form>
            </main>
        );
    }
}

export default Form.create({ name: 'market_info' })(injectIntl(MarketCreate));