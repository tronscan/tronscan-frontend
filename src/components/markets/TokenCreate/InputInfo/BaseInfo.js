import React, { Component } from 'react';
import { tu } from '../../../../utils/i18n';
import NumericInput from '../../../common/NumericInput';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import Lockr from 'lockr';
import { API_URL } from '../../../../constants';
import {
    Form, Row, Col, Input, Upload, Icon
} from 'antd';
const { TextArea } = Input;
class BaseInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logoLoading: false,
            ...this.props.state
        };
    }

    componentDidMount() {
        const { paramData: { logo } } = this.state;
        if (!Lockr.get('TokenLogo')){
            Lockr.set('TokenLogo', logo);
        }
        this.setState({
            logoUrl: logo,
        });
    }

    /**
     * change logo
     */
    handleLogoChange = (value) => {
        let autoCompleteResult;
        if (!value || /\.jpg|\.png|\.PNG|\.JPG|\.jpeg$/.test(value)) {
            autoCompleteResult = [];
        } else {
            autoCompleteResult = ['.jpg', '.png', '.PNG', '.JPG', '.jpeg'].map(domain => `${value}${domain}`);
        }
        this.setState({ autoCompleteResult });
    }

    /**
     * Converted into base64
     */
    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    /**
     * validate img
     */
    checkImageWH = (file, width, height) => {
        const { showModal } = this.props;
        const _this = this;
        return new Promise(function(resolve, reject) {
            let filereader = new FileReader();
            filereader.onload = e => {
                const src = e.target.result;
                const image = new Image();

                image.onload = function() {
                    if (width && this.width != width) {
                        showModal('Please upload the width to' + width + 'PX picture');
                        reject();
                    } else if (height && this.height != height) {
                        showModal('Please upload the height to' + height + 'PX picture');
                        reject();
                    } else {
                        _this.setBodyParameter();
                        let timer = null;
                        let count = 0;
                        timer = setInterval(() => {
                            if (_this.state.body) {
                                resolve();
                                clearInterval(timer);
                            } else {
                                count++;
                                if (count > 30) {
                                    count = 0;
                                    clearInterval(timer);
                                }
                            }
                        }, 100);

                    }
                };
                image.onerror = reject;
                image.src = src;
            };
            filereader.readAsDataURL(file);
        });
    }

    /**
     * Upload calibration
     */
    beforeUpload = (file) => {
        let { showModal } = this.props;
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            showModal('You can only upload JPG/JPEG/PNG file!');
        }
        const isLt200KB = file.size / 1024  < 200;

        if (!isLt200KB) {
            showModal('Image must smaller than 200KB!');
        }
        return isJpgOrPng && isLt200KB &&  this.checkImageWH(file, 100, 100);
    }

    /**
     * change img
     */
    handleChange = info => {
        let { file } = info;

        const { form: { setFieldsValue } } = this.props;
        if (file.status === 'uploading') {
            this.setState({ logoLoading: true });
            return;
        }
        if (file.response){
            const { retCode, data: { logo_url, file_name } } = file.response;
            const { paramData: { token_id, } } = this.state;
            if (retCode == 0){
                setFieldsValue({
                    logo: logo_url,
                    file_name,
                    token_id
                });
                this.setState({
                    logoLoading: false,
                    paramData: {
                        logo: logo_url,
                        file_name,
                    },
                });
            }
            if (file.status === 'done') {
                // Get this url from response in real world.
                this.getBase64(info.file.originFileObj, imageUrl =>
                    this.setimageUrl(imageUrl)
                );
            }
        }

    };

    /**
     * setting img url
     */
    setimageUrl = (imageUrl) => {
        Lockr.set('TokenLogo', imageUrl);

        this.setState({
            logoUrl: imageUrl,
        });
    }

    setBodyParameter = async(file) => {
        const { tronWeb } = this.props.account;
        const { paramData: { author, token_id }, type } = this.state;
        const data  = {
            issuer_addr: author,
            id: token_id,
            type,
        };
        const hash = tronWeb.toHex(JSON.stringify(data), false);
        const sig = await tronWeb.trx.sign(hash);
        const body = {
            content: JSON.stringify(data),
            sig
        };
        this.setState({
            body,
        });
    }

    render() {
        const { intl, form: { getFieldDecorator }, state: { isTrc20 } } = this.props;
        const { type, body, logoUrl, isUpdate } =  this.state;
        const isTrc10 = type === 'trc10';
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const actionUrl = `${API_URL}/external/upload/logo`;
        const bodyData = { body: JSON.stringify(body) };

        // token name item
        const tokenNameItem = (
            <Col  span={24} md={11}>
                <Form.Item label={tu('name_of_the_token')}>
                    {getFieldDecorator('tokenName', {
                        rules: [{ required: true, message: tu('name_v_required'), whitespace: true },
                            { min: 2, max: 30, message: tu('name_v_length') },
                            { pattern: /^[a-zA-Z0-9 ]+$/, message: tu('name_v_format') }],
                    })(
                        <Input placeholder={intl.formatMessage({ id: 'name_v_length' })}  disabled />
                    )}
                </Form.Item>
            </Col>
        );

        // token abbreviation item
        const tokenAbbrItem = (
            <Col  span={24} md={11}>
                <Form.Item label={tu('token_abbreviation')}>
                    {getFieldDecorator('tokenSymbol', {
                        rules: [{ required: true, message: tu('abbr_v_required'), whitespace: true },
                            { min: 2, max: 10, message: tu('abbr_v_length') },
                            { pattern: /^[a-zA-Z0-9]+$/, message: tu('abbr_v_format') }],
                    })(<Input placeholder={intl.formatMessage({ id: 'abbr_v_length' })} disabled />)}
                </Form.Item>
            </Col>
        );

        // description item
        const descriptionItem = (
            <Col  span={24} md={11}>
                <Form.Item label={tu('token_introduction')}>
                    {getFieldDecorator('description', {
                        rules: [{ required: true, message: tu('description_v_required'), whitespace: true },
                            { min: 1, max: 500, message: tu('description_v_length') }],
                    })(<TextArea autosize={{ minRows: 4, maxRows: 6 }}
                        placeholder={intl.formatMessage({ id: 'description_message' })}
                        disabled />
                    )}
                </Form.Item>
            </Col>
        );

        // total supply item
        const totalSupplyItem = (
            <Col  span={24} md={11}>
                <Form.Item label={tu('total_circulation')}>
                    {getFieldDecorator('totalSupply', {
                        rules: [
                            { required: true, message: tu('supply_v_required'), whitespace: true }],
                    })(
                        <NumericInput placeholder={intl.formatMessage({ id: 'supply_message' })}
                            decimal={!!isTrc20} disabled />
                    )}
                </Form.Item>
            </Col>
        );

        // token circulation item
        const circulationItem = (
            <Col  span={24} md={11}>
                <Form.Item label={tu('token_circulation')}>
                    {getFieldDecorator('circulation', {
                        rules: [{ required: true, message: tu('circulation_v_required'), whitespace: true },
                                // { validator: function(rule, value, callback) {
                                //     if (value > parseFloat(this.state.paramData.totalSupply)) {
                                //         return false;
                                //     }
                                //     callback();
                                // }, message: tu('token_circulation_format'), whitespace: true }
                        ]
                    })(
                        <NumericInput placeholder={intl.formatMessage({ id: 'placeholder_circulation' })}
                            decimal={!!isTrc20} disabled={isUpdate} />
                    )}
                </Form.Item>
            </Col>
        );

        // issuer address item
        const issuerAddressItem = (
            <Col  span={24} md={11}>
                <Form.Item label={tu('issuer_address')} required>
                    {getFieldDecorator('ownerAddress',{
                        rules: [{ required: true, message: tu('issuer_address_v_required') }],
                    })(
                        <Input disabled/>
                    )}
                </Form.Item>
            </Col>
        );

        // constact Token ID item
        const tokenIdItem = (
            <Col  span={24} md={11}>
                <Form.Item label={tu('token_id')} required>
                    {getFieldDecorator('tokenId',{
                        initialValue: 'id',
                        rules: [{ required: isTrc10, message: tu('token_id_v_required') }],
                    })(
                        <Input disabled/>
                    )}
                </Form.Item>
            </Col>
        );

        // constact address item
        const addressItem = (
            <Col  span={24} md={11}>
                <Form.Item label={tu('contract_address')} required>
                    {getFieldDecorator('tokenAddress',{
                        initialValue: 'id',
                        rules: [{ required: !isTrc10, message: tu('contract_address_required') }],
                    })(
                        <Input disabled/>
                    )}
                </Form.Item>
            </Col>
        );

        // logo item
        const logoItem = (
            <Col span={24} md={11} className={true ? 'd-block': 'd-none'}>
                <Form.Item label={tu('token_logo')} extra={tu('token_logo_upload_tip')}>
                    {getFieldDecorator('logo', {
                        rules: [{
                            required: true,
                            message: tu('attr_logo_v_required')
                        }]
                    })(
                        <div>
                            <Upload
                                name="file"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action={actionUrl}
                                data={bodyData}
                                beforeUpload={this.beforeUpload}
                                onChange={this.handleChange}
                                disabled
                            >
                                {logoUrl ? <img src={logoUrl} alt="Logo" style={{ width: '100%' }} /> : uploadButton}
                            </Upload>
                            <Input disabled className="d-none"/>
                        </div>


                    )}
                </Form.Item>
            </Col>
        );

        return (
            <div>
                <h4 className="mb-3">{tu('token_information')}</h4>
                <hr/>
                <Row gutter={24} type="flex" justify="space-between" className="px-2">
                    {tokenNameItem}
                    {tokenAbbrItem}
                    {totalSupplyItem}
                    {circulationItem}
                    {issuerAddressItem}
                    {isTrc10 ? tokenIdItem : addressItem}
                    {descriptionItem}
                    {logoItem}
                    <Col  span={24} md={11} className="d-none">
                        <Form.Item>
                            {getFieldDecorator('file_name')(
                                <Input disabled/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col  span={24} md={11} className="d-none">
                        <Form.Item>
                            {getFieldDecorator('token_id')(
                                <Input disabled/>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        account: state.app.account,
    };
}

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(BaseInfo));

