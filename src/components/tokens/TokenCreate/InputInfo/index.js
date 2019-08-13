import React, {Component} from 'react';
import {injectIntl} from "react-intl";
import {connect} from "react-redux";
import {t, tu} from "../../../../utils/i18n";
import BaseInfo from './BaseInfo'
import { ContractInfo } from './ContractInfo';
import { PriceInfo } from './PriceInfo';
import { SocialInfo } from './SocialInfo';
import {Form} from 'antd';
import {Client} from "../../../../services/api";
import moment from 'moment';
import SweetAlert from "react-bootstrap-sweetalert";
import { cloneDeep } from 'lodash'

@connect(
    state => ({
        account: state.app.account,
        wallet: state.wallet.current,
    })
)

export class TokenCreate extends Component {

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
        const { type,isUpdate } = this.props.state
        this.props.nextState({leave_lock: true})
        this.setState({
            isTrc10 : (type === 'trc10'),
            isTrc20 : (type === 'trc20')
        })

    }

    renderSubmit = () => {
        let {intl, account} = this.props;
        const {paramData: {author}, iconList, isUpdate} = this.state;
        if (account.address !== author) {
            this.setState({
                modal:
                    <SweetAlert
                        error
                        confirmBtnText={intl.formatMessage({id: 'confirm'})}
                        confirmBtnBsStyle="success"
                        onConfirm={this.hideModal}
                        style={{marginLeft: '-240px', marginTop: '-195px'}}
                    >
                        {tu("token_create_auther_different")}
                    </SweetAlert>
                }
            );
            return false
        }
        return true
    };
    showModal = (msg) => {
        let { intl } = this.props;
        this.setState({
            modal:
                <SweetAlert
                    error
                    confirmBtnText={intl.formatMessage({id: 'confirm'})}
                    confirmBtnBsStyle="success"
                    onConfirm={this.hideModal}
                    style={{marginLeft: '-240px', marginTop: '-195px'}}
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
        const {paramData: {author}, iconList, isUpdate, count} = this.state;
        e.preventDefault();
        // if (!this.renderSubmit() && isUpdate)
        //     return;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.nextState({paramData: values, iconList, social_current: count})
                this.props.nextStep(2)
            }
        });
    }

    changeCount =(count) => {
      this.setState({count})
    }

    async loadContractCode(id) {
        setTimeout(() => {
            this.props.form.validateFields(['contract_address'],(err, values) => {
                if (!err) {
                    this.setState({loading: true});
                    Client.getContractInfo(id).then(contractInfo => {
                        if(contractInfo.data.address == undefined){
                            this.setState({
                                contract_created_date: moment(contractInfo.data[0].date_created) || '',
                                contract_created_address: contractInfo.data[0].creator.address || '',
                            }, () => {
                                this.props.form.setFieldsValue({ contract_created_date:contractInfo.data[0].date_created?moment(contractInfo.data[0].date_created) : moment(1539204941000)});
                                this.props.form.setFieldsValue({ contract_created_address:contractInfo.data[0].creator.address || '' });
                            });
                        }
                    });
                }
            });
        }, 200);
    }

    render() {
        const {intl, nextStep} = this.props;
        const { modal,isUpdate } = this.state;
        const {form} = this.props;
        return (
            <main className="">
                {modal}
                <Form
                    className="ant-advanced-search-form"
                >
                    {/* base info */}
                    <BaseInfo form={form} intl={intl} state={this.state} showModal={(msg) => {this.showModal(msg)}}/>

                    {/* contract info */}
                    <ContractInfo form={form} intl={intl} state={this.state} loadContractCode={(id) => { this.loadContractCode(id) }}/>

                    {/* price info */}
                    <PriceInfo form={form} intl={intl} state={this.state}/>

                    {/* social info */}
                    <SocialInfo form={form} intl={intl} state={this.state} changeCount={ (num) => this.changeCount(num)}/>

                    <div className="text-right px-2">
                        {!isUpdate && <a className="btn btn-default btn-lg" onClick={() => nextStep(0)}>{tu('prev_step')}</a>}
                        <button className="ml-4 btn btn-danger btn-lg" onClick={this.submit}>{tu('next')}</button>
                    </div>

                </Form>
            </main>
        )
    }
}

function mapPropsToFields(props) {
  let data = props.state.paramData
  let params = {} 

  Object.keys(data).map(key => {
    params[key] = Form.createFormField({
      value: data[key],
    })
  })
  return  params
}


export default Form.create({name: 'input_info', mapPropsToFields})(injectIntl(TokenCreate));



