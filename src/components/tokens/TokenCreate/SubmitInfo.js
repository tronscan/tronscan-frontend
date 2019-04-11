import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../../utils/i18n";
import {connect} from "react-redux";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import 'moment/min/locales';
import {
    Form, Row, Col, Input, Button, Icon,
} from 'antd';

export class SubmitInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...this.props.state
        };
    }

    componentDidMount() {}

    setSelect(type) {
        this.setState({type}, ()=> {
            this.props.nextState(this.state)
        })
    }



    render() {
        let {intl} = this.props
        const { getFieldDecorator } = this.props.form;
        return (
            <main className="">
                <Form
                    className="ant-advanced-search-form"
                    onSubmit={this.handleSearch}
                >
                    {/* base info */}
                    <h4 className="mb-3">{tu('basic_info')}</h4>
                    <hr/>
                    <Row gutter={24} type="flex" justify="space-between" className="px-2">
                        <Col  span={24} md={11}>
                            <Form.Item label={tu('name_of_the_token')}>
                                {getFieldDecorator('token_name', {
                                    rules: [{ required: true, message: tu('name_v_required'), whitespace: true},
                                        {max: 2, message: tu('name_v_required')}],
                                })(
                                    <Input placeholder={tu('token_message')}/>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24} md={11}>
                            <Form.Item label={tu('name_of_the_token')}>
                                {getFieldDecorator('token_name', {
                                    rules: [{ required: true, message: tu('通证名称必须填写')}],
                                })(
                                    <Input placeholder="placeholder" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24} md={11}>
                            <Form.Item label={tu('name_of_the_token')}>
                                {getFieldDecorator('token_name', {
                                    rules: [{ required: true, message: tu('通证名称必须填写')}],
                                })(
                                    <Input placeholder={tu('token_message')} maxLength={2}/>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <button className="btn btn-default btn-lg"></button>

                </Form>
            </main>
        )
    } 
}


export default injectIntl(SubmitInfo);
