import React, {Component} from 'react';
import {t, tu} from "../../../../utils/i18n";
import NumericInput from '../../../common/NumericInput';
import SweetAlert from "react-bootstrap-sweetalert";

import {
  Form, Row, Col, Input, InputNumber, AutoComplete, Upload, Icon, message
} from 'antd';
const { TextArea } = Input;
const AutoCompleteOption = AutoComplete.Option;




export class BaseInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logoLoading: false,
      autoCompleteResult: [],
      precision_20: 18,
      ...this.props.state
    };
  }

  handleLogoChange = (value) => {
    let autoCompleteResult;
    if (!value || /\.jpg|\.png|\.PNG|\.JPG|\.jpeg$/.test(value)) {
      autoCompleteResult = [];
    }else {
      autoCompleteResult = ['.jpg', '.png','.PNG','.JPG','.jpeg'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  }

  getBase64 = (img, callback) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result));
      reader.readAsDataURL(img);
  }
  checkImageWH = (file, width, height) => {
      return new Promise(function (resolve, reject) {
          let filereader = new FileReader();
          filereader.onload = e => {
              let src = e.target.result;
              const image = new Image();

              image.onload = function () {
                  if (width && this.width != width) {
                      message.error('请上传宽为' + width + '的图片');
                      reject();
                  } else if (height && this.height != height) {
                      message.error('请上传宽为' + height + '的图片');
                      reject();
                  } else {
                      resolve();
                  }
              };
              image.onerror = reject;
              image.src = src;
          };
          filereader.readAsDataURL(file);
      });
  }

   beforeUpload = (file) => {
     let { intl, showModal } = this.props;
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
           showModal('You can only upload JPG/JPEG/PNG file!')
          //message.error('You can only upload JPG/PNG file!');
      }
      console.log('file.size',file.size)
      const isLt2M = file.size / 1024  < 200;
      if (!isLt2M) {
          message.error('Image must smaller than 200KB!');
      }
      return isJpgOrPng && isLt2M && this.checkImageWH(file, 100, 100);
  }
  handleChange = info => {
      console.log('info',info)
      if (info.file.status === 'uploading') {
          this.setState({ logoLoading: true });
          return;
      }
      if (info.file.status === 'done') {
          // Get this url from response in real world.
          this.getBase64(info.file.originFileObj, imageUrl =>
              this.setState({
                  imageUrl,
                  logoLoading: false,
              }),
          );
      }
  };

  render() {
    const { getFieldDecorator } = this.props.form
    const { intl } = this.props
    const { precision_20, autoCompleteResult, imageUrl } =  this.state;
    const { isTrc20, isUpdate } = this.props.state;
    const logoOptions = autoCompleteResult.map(logo => (
      <AutoCompleteOption key={logo}>{logo}</AutoCompleteOption>
    ));
    const uploadButton = (
        <div>
          <Icon type={this.state.loading ? 'loading' : 'plus'} />
          <div className="ant-upload-text">Upload</div>
        </div>
    );

    return (
      <div>
      <h4 className="mb-3">{tu('basic_info')}</h4>
      <hr/>
      <Row gutter={24} type="flex" justify="space-between" className="px-2">
        <Col  span={24} md={11}>
          <Form.Item label={tu('name_of_the_token')}>
            {getFieldDecorator('token_name', {
              rules: [{ required: true, message: tu('name_v_required'), whitespace: true},
                      {min: 2, max: 30, message: tu('name_v_length')},
                      {pattern: /^[a-zA-Z0-9 ]+$/, message: tu('name_v_format')}],
            })(
              <Input placeholder={intl.formatMessage({id: 'name_v_length'})}  disabled={isUpdate}/>
            )}
          </Form.Item>
        </Col>
        <Col  span={24} md={11}>
          <Form.Item label={tu('token_abbr')}>
            {getFieldDecorator('token_abbr', {
              rules: [{ required: true, message: tu('abbr_v_required'), whitespace: true},
                      {min: 2, max: 10, message: tu('abbr_v_length')},
                      {pattern: /^[a-zA-Z0-9]+$/, message: tu('abbr_v_format')}],
            })(
              <Input placeholder={intl.formatMessage({id: 'abbr_v_length'})} disabled={isUpdate}/>
            )}
          </Form.Item>
        </Col>
        <Col  span={24} md={11}>
          <Form.Item label={tu('description')}>
            {getFieldDecorator('token_introduction', {
              rules: [{ required: true, message: tu('description_v_required'), whitespace: true},
                      {min: 1, max: 500, message: tu('description_v_length')}],
            })(
              <TextArea autosize={{ minRows: 4, maxRows: 6 }}  placeholder={intl.formatMessage({id: 'description_message'})} disabled={isUpdate && !isTrc20}/>
            )}
          </Form.Item>
        </Col>
        <Col  span={24} md={11}>
          <Form.Item label={tu('total_supply')}>
            {getFieldDecorator('token_supply', {
              rules: [{ required: true, message: tu('supply_v_required'), whitespace: true}],
            })(
              <NumericInput placeholder={intl.formatMessage({id: 'supply_message'})} disabled={isUpdate} decimal={isTrc20?true:false}/>
            )}
          </Form.Item>
        </Col>
        <Col  span={24} md={11}>
          <Form.Item label={tu('TRC20_decimals')}>
            {getFieldDecorator('precision',{
              rules: [{ required: true, message: tu('decimals_v_required')}],
            })(
              <InputNumber min={0} max={ isTrc20? precision_20: 6} className="w-100" disabled={isUpdate}/>
            )}
          </Form.Item>
        </Col>
        {/*<Col  span={24} md={11} className={ isTrc20? 'd-block': 'd-none'}>*/}
        <Col span={24} md={11} className={ isTrc20 || isUpdate? 'd-block': 'd-none'}>
          <Form.Item label={tu('token_logo')}>
            {getFieldDecorator('logo_url', {
              rules: [{ required: isTrc20 || isUpdate, message: tu('logo_v_required'), whitespace: true},
                      {pattern: /\.jpg|\.png|\.PNG|\.JPG|\.jpeg$/, message: tu('logo_v_format')}],
            })(
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  beforeUpload={this.beforeUpload}
                  onChange={this.handleChange}
                  >
                  {imageUrl ? <img src={imageUrl} alt="Logo" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
            )}
          </Form.Item>
        </Col>
        <Col  span={24} md={11}>
          <Form.Item label={tu('issuer')} required>
            {getFieldDecorator('author',{
              rules: [{ required: true, message: ''}],
            })(
              <Input disabled/>
            )}
          </Form.Item>
        </Col>
      </Row>
    </div>
    )
  }
}
