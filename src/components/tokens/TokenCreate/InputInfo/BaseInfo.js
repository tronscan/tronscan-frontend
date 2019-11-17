import React, { Component } from "react";
import { t, tu } from "../../../../utils/i18n";
import NumericInput from "../../../common/NumericInput";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import Lockr from "lockr";
import { API_URL, CONTRACT_MAINNET_API_URL } from "../../../../constants";

import {
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  AutoComplete,
  Upload,
  Icon,
  message
} from "antd";
const { TextArea } = Input;
const AutoCompleteOption = AutoComplete.Option;

class BaseInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logoLoading: false,
      autoCompleteResult: [],
      precision_20: 18,
      ...this.props.state
    };
  }
  componentDidMount() {
    let {
      paramData: { logo_url }
    } = this.state;
    if (!Lockr.get("TokenLogo")) {
      Lockr.set("TokenLogo", logo_url);
    }
    this.setState({
      logoUrl: logo_url
    });
  }

  handleLogoChange = value => {
    let autoCompleteResult;
    if (!value || /\.jpg|\.png|\.PNG|\.JPG|\.jpeg$/.test(value)) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = [".jpg", ".png", ".PNG", ".JPG", ".jpeg"].map(
        domain => `${value}${domain}`
      );
    }
    this.setState({ autoCompleteResult });
  };

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  checkImageWH = (file, width, height) => {
    let { intl, showModal } = this.props;
    let _this = this;
    return new Promise(function(resolve, reject) {
      let filereader = new FileReader();
      filereader.onload = e => {
        let src = e.target.result;
        const image = new Image();

        image.onload = function() {
          if (width && this.width != width) {
            showModal("Please upload the width to" + width + "PX picture");
            reject();
          } else if (height && this.height != height) {
            showModal("Please upload the height to" + height + "PX picture");
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
  };

  beforeUpload = file => {
    let { intl, showModal } = this.props;
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      showModal("You can only upload JPG/JPEG/PNG file!");
    }
    const isLt200KB = file.size / 1024 < 200;

    if (!isLt200KB) {
      showModal("Image must smaller than 200KB!");
    }

    return isJpgOrPng && isLt200KB && this.checkImageWH(file, 100, 100);
  };

  handleChange = info => {
    let { file } = info;
    if (info.file.status === "uploading") {
      this.setState({ logoLoading: true });
      return;
    }
    if (file.response) {
      if (file.response.retCode == 0) {
        this.props.form.setFieldsValue({
          logo_url: file.response.data.logo_url,
          file_name: file.response.data.file_name,
          token_id: this.state.paramData.token_id
        });
        this.setState({
          logoLoading: false,
          paramData: {
            logo_url: file.response.data.logo_url,
            file_name: file.response.data.file_name
          }
        });
      }
      if (info.file.status === "done") {
        // Get this url from response in real world.
        this.getBase64(info.file.originFileObj, imageUrl =>
          this.setimageUrl(imageUrl)
        );
      }
    }
  };

  setimageUrl = imageUrl => {
    Lockr.set("TokenLogo", imageUrl);
    this.setState({
      logoUrl: imageUrl
    });
  };

  setBodyParameter = async file => {
    const { tronWeb } = this.props.account;
    let data = {
      issuer_addr: this.state.paramData.author,
      id: this.state.paramData.token_id,
      type: this.state.type
    };
    let hash = tronWeb.toHex(JSON.stringify(data), false);
    let sig = await tronWeb.trx.sign(hash);
    let body = {
      content: JSON.stringify(data),
      sig: sig
    };
    this.setState(
      {
        body
      },
      () => {}
    );
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { intl } = this.props;
    let {
      precision_20,
      autoCompleteResult,
      paramData: { logo_url },
      body,
      logoUrl
    } = this.state;
    const { isTrc20, isUpdate } = this.props.state;
    const logoOptions = autoCompleteResult.map(logo => (
      <AutoCompleteOption key={logo}>{logo}</AutoCompleteOption>
    ));
    const defaultImg = require("../../../../images/logo_default.png");

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? "loading" : "plus"} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    let actionUrl = `${CONTRACT_MAINNET_API_URL}/external/upload/logo`;
    let bodyData = { body: JSON.stringify(body) };

    return (
      <div>
        <h4 className="mb-3">{tu("basic_info")}</h4>
        <hr />
        <Row gutter={24} type="flex" justify="space-between" className="px-2">
          <Col span={24} md={11}>
            <Form.Item label={tu("name_of_the_token")}>
              {getFieldDecorator("token_name", {
                rules: [
                  {
                    required: true,
                    message: tu("name_v_required"),
                    whitespace: true
                  },
                  { min: 2, max: 30, message: tu("name_v_length") },
                  { pattern: /^[a-zA-Z0-9 ]+$/, message: tu("name_v_format") }
                ]
              })(
                <Input
                  placeholder={intl.formatMessage({ id: "name_v_length" })}
                  disabled={isUpdate}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24} md={11}>
            <Form.Item label={tu("token_abbr")}>
              {getFieldDecorator("token_abbr", {
                rules: [
                  {
                    required: true,
                    message: tu("abbr_v_required"),
                    whitespace: true
                  },
                  { min: 2, max: 10, message: tu("abbr_v_length") },
                  { pattern: /^[a-zA-Z0-9]+$/, message: tu("abbr_v_format") }
                ]
              })(
                <Input
                  placeholder={intl.formatMessage({ id: "abbr_v_length" })}
                  disabled={isUpdate}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24} md={11}>
            <Form.Item label={tu("description")}>
              {getFieldDecorator("token_introduction", {
                rules: [
                  {
                    required: true,
                    message: tu("description_v_required"),
                    whitespace: true
                  },
                  { min: 1, max: 500, message: tu("description_v_length") }
                ]
              })(
                <TextArea
                  autosize={{ minRows: 4, maxRows: 6 }}
                  placeholder={intl.formatMessage({
                    id: "description_message"
                  })}
                  disabled={isUpdate && !isTrc20}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24} md={11}>
            <Form.Item label={tu("total_supply")}>
              {getFieldDecorator("token_supply", {
                rules: [
                  {
                    required: true,
                    message: tu("supply_v_required"),
                    whitespace: true
                  }
                ]
              })(
                <NumericInput
                  placeholder={intl.formatMessage({ id: "supply_message" })}
                  disabled={isUpdate}
                  decimal={isTrc20 ? true : false}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24} md={11}>
            <Form.Item label={tu("TRC20_decimals")}>
              {getFieldDecorator("precision", {
                rules: [{ required: true, message: tu("decimals_v_required") }]
              })(
                <InputNumber
                  min={0}
                  max={isTrc20 ? precision_20 : 6}
                  className="w-100"
                  disabled={isUpdate}
                />
              )}
            </Form.Item>
          </Col>
          {/*<Col  span={24} md={11} className={ isTrc20? 'd-block': 'd-none'}>*/}
          <Col span={24} md={11} className={isUpdate ? "d-block" : "d-none"}>
            <Form.Item
              label={tu("token_logo")}
              extra={tu("token_logo_upload_tip")}
            >
              {getFieldDecorator("logo_url")(
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
                  >
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Logo"
                        style={{ width: "100%" }}
                        onError={e => {
                          e.target.onerror = null;
                          e.target.src = defaultImg;
                        }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                  <Input disabled className="d-none" />
                </div>
              )}
            </Form.Item>
          </Col>

          <Col span={24} md={11}>
            <Form.Item label={tu("issuer")} required>
              {getFieldDecorator("author", {
                rules: [{ required: true, message: "" }]
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={24} md={11} className="d-none">
            <Form.Item>
              {getFieldDecorator("file_name")(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={24} md={11} className="d-none">
            <Form.Item>
              {getFieldDecorator("token_id")(<Input disabled />)}
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    account: state.app.account
  };
}

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(BaseInfo));
