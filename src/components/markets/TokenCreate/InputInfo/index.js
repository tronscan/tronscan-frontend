import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { tu } from '../../../../utils/i18n';
import BaseInfo from './BaseInfo';
import { PriceInfo } from './PriceInfo';
import { SocialInfo } from './SocialInfo';
import { Form } from 'antd';
import SweetAlert from 'react-bootstrap-sweetalert';

export class InputInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isTrc10: false,
            isTrc20: false,
            count: 0,
            ...this.props.state
        };
    }

    componentDidMount() {
        const { type } = this.props.state;
        this.props.nextState({ leave_lock: true });
        this.setState({
            isTrc10: (type === 'trc10'),
            isTrc20: (type === 'trc20')
        });

    }

    showModal = (msg) => {
        let { intl } = this.props;
        this.setState({
            modal: <SweetAlert
                error
                confirmBtnText={intl.formatMessage({ id: 'confirm' })}
                confirmBtnBsStyle="success"
                onConfirm={this.hideModal}
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

    submit = (e) => {
        const { count } = this.state;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.nextState({
                    paramData: values,
                    social_current: count
                });
                this.props.nextStep(1);
            }
        });
    }

    render() {
        const { intl } = this.props;
        const { modal } = this.state;
        const { form } = this.props;
        return (
            <main>
                {modal}
                <Form
                    className="ant-advanced-search-form"
                >
                    {/* base info */}
                    <BaseInfo form={form} intl={intl} state={this.state} showModal={(msg) => {
                        this.showModal(msg);
                    }}/>

                    {/* price info */}
                    <PriceInfo form={form} intl={intl} state={this.state}/>

                    {/* social info */}
                    <SocialInfo form={form} intl={intl} state={this.state} />

                    <div className="text-right px-2">
                        {<a className="btn btn-default btn-lg"
                            onClick={() => {this.props.history.replace('/account')}}>{tu('sign_out')}</a>}
                        <button className="ml-4 btn btn-danger btn-lg" onClick={this.submit}>{tu('next')}</button>
                    </div>

                </Form>
            </main>
        );
    }
}

function mapPropsToFields(props) {
    let data = props.state.paramData;
    let params = {};

    Object.keys(data).map(key => {
        params[key] = Form.createFormField({
            value: data[key],
        });
    });
    return  params;
}


export default Form.create({ name: 'input_info', mapPropsToFields })(injectIntl(InputInfo));



